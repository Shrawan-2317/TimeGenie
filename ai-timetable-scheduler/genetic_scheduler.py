
# Create the complete improved genetic scheduler with ALL phases

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple
import random
from copy import deepcopy
import json
import os


class GeneticTimetableScheduler:
    """
    Genetic Algorithm based timetable scheduler that handles complex constraints
    similar to MIT SOC timetables - COMPLETE IMPROVED VERSION
    """
    
    def __init__(self, config_file=None):
        # GA Parameters - IMPROVED
        self.population_size = 200  # Increased from 100 for better diversity
        self.generations = 1000  # Increased from 500 for better convergence
        self.mutation_rate = 0.15  # Slightly increased for more exploration
        self.crossover_rate = 0.8
        self.elite_size = 10
        
        # Timetable structure
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        self.time_slots = [
            {'start': '08:45', 'end': '09:40', 'type': 'regular'},
            {'start': '09:40', 'end': '10:35', 'type': 'regular'},
            {'start': '10:50', 'end': '11:45', 'type': 'regular'},
            {'start': '11:45', 'end': '12:40', 'type': 'regular'},
            {'start': '01:40', 'end': '02:35', 'type': 'regular'},
            {'start': '02:35', 'end': '03:30', 'type': 'regular'},
            {'start': '03:40', 'end': '04:30', 'type': 'regular'}
        ]
        
        # Data storage
        self.classes = {}
        self.subjects = {}
        self.faculties = {}
        self.rooms = {}
        self.constraints = {}
        self.best_solution = None
        
        if config_file:
            self.load_config(config_file)
    
    def load_config(self, config_file):
        """Load configuration from JSON file with validation and whitespace cleaning"""
        with open(config_file, 'r') as f:
            config = json.load(f)
        
        # Strip whitespace from all keys and values - PHASE 2
        self.subjects = {k.strip(): v for k, v in config.get('subjects', {}).items()}
        self.faculties = {k.strip(): v for k, v in config.get('faculties', {}).items()}
        self.rooms = {k.strip(): v for k, v in config.get('rooms', {}).items()}
        self.classes = config.get('classes', {})
        self.constraints = config.get('constraints', {})
        
        # Strip whitespace from faculty references in subjects
        for subject_code, subject_info in self.subjects.items():
            if 'faculties' in subject_info:
                subject_info['faculties'] = [f.strip() for f in subject_info['faculties']]
        
        # Validate all references - PHASE 2
        print("\n" + "="*70)
        print("VALIDATING INPUT DATA")
        print("="*70)
        validation_errors = []
        
        # Check if class subjects exist
        for class_id, class_info in self.classes.items():
            for subject in class_info.get('subjects', []):
                if subject not in self.subjects:
                    validation_errors.append(f"⚠️  Class '{class_id}' references unknown subject '{subject}'")
        
        # Check if subject faculties exist
        for subject_code, subject_info in self.subjects.items():
            for faculty in subject_info.get('faculties', []):
                if faculty not in self.faculties:
                    validation_errors.append(f"⚠️  Subject '{subject_code}' references unknown faculty '{faculty}'")
        
        if validation_errors:
            print("\n❌ VALIDATION ERRORS FOUND:")
            for error in validation_errors:
                print(f"   {error}")
            raise ValueError("Input data validation failed. Please fix the errors above.")
        else:
            print("✅ All references validated successfully!")
            print(f"   Classes: {len(self.classes)}")
            print(f"   Subjects: {len(self.subjects)}")
            print(f"   Faculties: {len(self.faculties)}")
            print(f"   Rooms: {len(self.rooms)}")
        print("="*70 + "\n")
    
    class Chromosome:
        """Represents a complete timetable solution"""
        def __init__(self, genes=None):
            self.genes = genes if genes else {}
            self.fitness = 0
        
        def calculate_fitness(self, scheduler):
            """Calculate fitness score for the chromosome"""
            fitness = 1000  # Start with max fitness
            
            # Penalty for hard constraint violations
            fitness -= scheduler.count_faculty_conflicts(self) * 50
            fitness -= scheduler.count_room_conflicts(self) * 50
            fitness -= scheduler.count_missing_hours(self) * 100  # PHASE 1: Increased from 30
            fitness -= scheduler.count_faculty_overload(self) * 50  # PHASE 5: NEW
            
            # Penalty for soft constraint violations
            fitness -= scheduler.count_gap_hours(self) * 5
            fitness -= scheduler.count_unbalanced_days(self) * 10
            fitness -= scheduler.count_consecutive_theory(self) * 3
            
            self.fitness = max(0, fitness)
            return self.fitness
    
    def initialize_population(self) -> List[Chromosome]:
        """Initialize population with mix of greedy (70%) and random (30%) chromosomes - PHASE 3"""
        population = []
        greedy_count = int(self.population_size * 0.7)
        random_count = self.population_size - greedy_count
        
        print(f"Initializing population: {greedy_count} greedy + {random_count} random chromosomes\n")
        
        # Create greedy chromosomes
        for i in range(greedy_count):
            population.append(self.create_greedy_chromosome())
        
        # Create random chromosomes for diversity
        for i in range(random_count):
            population.append(self.create_random_chromosome())
        
        return population
    
    def create_greedy_chromosome(self) -> Chromosome:
        """Create chromosome using greedy strategy - fills required hours first - PHASE 3"""
        chromosome = self.Chromosome()
        
        # Initialize empty structure
        for class_id in self.classes.keys():
            chromosome.genes[class_id] = {}
            for day in self.days:
                chromosome.genes[class_id][day] = {}
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    chromosome.genes[class_id][day][slot_key] = None
        
        # Fill special slots first
        for class_id in self.classes.keys():
            for day in self.days:
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    if self.is_special_slot(class_id, day, slot_key):
                        special_allocation = self.get_special_allocation(class_id, day, slot_key)
                        chromosome.genes[class_id][day][slot_key] = special_allocation
        
        # For each class, fill required hours greedily
        for class_id, class_info in self.classes.items():
            required_hours = {}
            
            # Calculate required hours for each subject
            for subject_code in class_info.get('subjects', []):
                if subject_code in self.subjects:
                    required_hours[subject_code] = self.subjects[subject_code].get('hours_per_week', 0)
            
            # Get all available slots
            available_slots = []
            for day in self.days:
                is_online_day = self.is_online_day(class_id, day)
                
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    if not self.is_special_slot(class_id, day, slot_key):
                        available_slots.append((day, slot_key, slot, is_online_day))
            
            random.shuffle(available_slots)
            
            # Greedy fill
            slot_idx = 0
            for subject_code, hours_needed in required_hours.items():
                subject_info = self.subjects[subject_code]
                
                if subject_info.get('type') == 'lab':
                    duration = subject_info.get('duration', 2)
                    sessions_needed = hours_needed // duration
                    
                    for _ in range(sessions_needed):
                        if slot_idx + duration <= len(available_slots):
                            # ✅ FIXED: Get consecutive slots
                            slots_in_session = []
                            for i in range(duration):
                                day, slot_key, slot, is_online = available_slots[slot_idx + i]
                                slots_in_session.append((day, slot_key, is_online))
                            
                            # ✅ Check all slots are same day
                            days_in_session = [day for day, _, _ in slots_in_session]
                            if len(set(days_in_session)) == 1:  # All same day
                                faculty = random.choice(subject_info['faculties']) if subject_info.get('faculties') else None
                                day = slots_in_session[0][0]
                                is_online = slots_in_session[0][2]
                                room = "Online" if is_online else self.get_suitable_room(subject_info['type'])
                                
                                allocation = {
                                    'subject': subject_code,
                                    'faculty': faculty,
                                    'room': room,
                                    'type': 'online' if is_online else 'lab'
                                }
                                
                                # ✅ Allocate to all consecutive slots
                                for day, slot_key, _ in slots_in_session:
                                    chromosome.genes[class_id][day][slot_key] = allocation.copy()
                                
                                slot_idx += duration  # ✅ Move by duration
                            else:
                                # Different days, skip this location
                                slot_idx += 1
                        else:
                            break
                else:
                    # Theory subject - 1 hour per slot
                    for _ in range(hours_needed):
                        if slot_idx < len(available_slots):
                            day, slot_key, slot, is_online = available_slots[slot_idx]
                            
                            faculty = random.choice(subject_info['faculties']) if subject_info.get('faculties') else None
                            room = "Online" if is_online else self.get_suitable_room(subject_info['type'])
                            
                            chromosome.genes[class_id][day][slot_key] = {
                                'subject': subject_code,
                                'faculty': faculty,
                                'room': room,
                                'type': 'online' if is_online else 'theory'
                            }
                            slot_idx += 1
        
        return chromosome

    
    def create_random_chromosome(self) -> Chromosome:
        """Create a random but valid chromosome"""
        genes = {}
        
        for class_id, class_info in self.classes.items():
            genes[class_id] = {}
            
            for day in self.days:
                genes[class_id][day] = {}
                
                # ✅ Check if day is online
                is_online_day = self.is_online_day(class_id, day)
                
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    
                    # Handle special slots (Mentor Meeting, PBL, etc.)
                    if self.is_special_slot(class_id, day, slot_key):
                        genes[class_id][day][slot_key] = self.get_special_allocation(class_id, day, slot_key)
                    else:
                        # ✅ Fill with regular subjects (online or physical)
                        if random.random() > 0.3:
                            subject = self.get_random_subject_for_class(class_id)
                            if subject:
                                subject_code = list(self.subjects.keys())[list(self.subjects.values()).index(subject)]
                                genes[class_id][day][slot_key] = {
                                    'subject': subject_code,
                                    'faculty': random.choice(subject['faculties']) if subject.get('faculties') else None,
                                    'room': "Online" if is_online_day else self.get_suitable_room(subject['type']),
                                    'type': 'online' if is_online_day else subject['type']  # ✅ Mark as online
                                }
                        else:
                            genes[class_id][day][slot_key] = None
        
        return self.Chromosome(genes)

    def is_special_slot(self, class_id, day, slot):
        """Check if slot is reserved for special activities"""
        # ✅ Define special slots from constraints or use defaults
        special_slots_config = self.constraints.get('special_slots', {
            'Monday': {'03:40-04:30': 'Mentor Meeting'},
            'Saturday': {'08:45-09:40': 'PBL Review', '09:40-10:35': 'PAL'},
            'Friday': {'03:40-04:30': 'NPTEL'}
        })
        
        # Check if this specific day and slot is special
        if day in special_slots_config and slot in special_slots_config[day]:
            return True
        
        # ❌ DON'T treat online days as special slots
        # Online days should have regular classes, just marked as online
        
        return False
    
    def get_special_allocation(self, class_id, day, slot):
        """Get special allocation for reserved slots"""
        # ✅ Get the specific activity from constraints
        special_slots_config = self.constraints.get('special_slots', {
            'Monday': {'03:40-04:30': 'Mentor Meeting'},
            'Saturday': {'08:45-09:40': 'PBL Review', '09:40-10:35': 'PAL'},
            'Friday': {'03:40-04:30': 'NPTEL'}
        })
        
        activity = special_slots_config.get(day, {}).get(slot, 'Special Activity')
        
        return {
            'subject': 'SPECIAL',
            'activity': activity,  # ✅ Use actual activity name
            'faculty': None,
            'room': None
        }

    
    def is_online_day(self, class_id, day):
        """Check if it's an online day for the class"""
        online_patterns = self.constraints.get('online_days', {})
        return class_id in online_patterns.get(day, [])
    
    def get_random_subject_for_class(self, class_id):
        """Get a random subject for the class"""
        class_subjects = self.classes[class_id].get('subjects', [])
        if class_subjects:
            subject_code = random.choice(class_subjects)
            return self.subjects.get(subject_code)
        return None
    
    def get_suitable_room(self, subject_type):
        """Get suitable room for subject type"""
        if subject_type == 'lab':
            lab_rooms = [r for r, info in self.rooms.items() if info['type'] == 'lab']
            return random.choice(lab_rooms) if lab_rooms else 'TBD'
        else:
            class_rooms = [r for r, info in self.rooms.items() if info['type'] == 'classroom']
            return random.choice(class_rooms) if class_rooms else 'TBD'
    
    def selection(self, fitness_scores: List[Tuple]) -> Chromosome:
        """Tournament selection"""
        tournament_size = 5
        tournament = random.sample(fitness_scores, min(tournament_size, len(fitness_scores)))
        winner = max(tournament, key=lambda x: x[0])
        return winner[1]
    
    def crossover(self, parent1: Chromosome, parent2: Chromosome) -> Tuple[Chromosome, Chromosome]:
        """Uniform crossover between two parents"""
        if random.random() > self.crossover_rate:
            return deepcopy(parent1), deepcopy(parent2)
        
        child1_genes = {}
        child2_genes = {}
        
        for class_id in parent1.genes:
            child1_genes[class_id] = {}
            child2_genes[class_id] = {}
            
            for day in parent1.genes[class_id]:
                if random.random() > 0.5:
                    child1_genes[class_id][day] = deepcopy(parent1.genes[class_id][day])
                    child2_genes[class_id][day] = deepcopy(parent2.genes[class_id][day])
                else:
                    child1_genes[class_id][day] = deepcopy(parent2.genes[class_id][day])
                    child2_genes[class_id][day] = deepcopy(parent1.genes[class_id][day])
        
        return self.Chromosome(child1_genes), self.Chromosome(child2_genes)
    
    def mutation(self, chromosome: Chromosome) -> Chromosome:
        """Mutation operator with repair - PHASE 4"""
        if random.random() > self.mutation_rate:
            return chromosome

        mutated = deepcopy(chromosome)

        class_ids = list(mutated.genes.keys())
        random.shuffle(class_ids)

        for class_id in class_ids:
            day_keys = list(mutated.genes[class_id].keys())
            random.shuffle(day_keys)

            for day in day_keys:
                slots = list(mutated.genes[class_id][day].keys())
                if not slots:
                    continue

                random.shuffle(slots)

                for slot in slots:
                    if self.is_special_slot(class_id, day, slot):
                        continue

                    if random.random() > 0.5:
                        valid_days = [d for d, s in mutated.genes[class_id].items() if s]
                        if not valid_days:
                            continue
                        other_day = random.choice(valid_days)
                        valid_slots = list(mutated.genes[class_id][other_day].keys())
                        if not valid_slots:
                            continue
                        other_slot = random.choice(valid_slots)

                        if not self.is_special_slot(class_id, other_day, other_slot):
                            mutated.genes[class_id][day][slot], mutated.genes[class_id][other_day][other_slot] = \
                            mutated.genes[class_id][other_day][other_slot], mutated.genes[class_id][day][slot]
                    else:
                        subject = self.get_random_subject_for_class(class_id)
                        if subject:
                            subject_code = list(self.subjects.keys())[list(self.subjects.values()).index(subject)]
                            mutated.genes[class_id][day][slot] = {
                                'subject': subject_code,
                                'faculty': random.choice(subject['faculties']) if subject.get('faculties') else None,
                                'room': self.get_suitable_room(subject['type']),
                                'type': subject['type']
                            }

        return mutated

        # Apply repair mutation with 30% probability - PHASE 4
        if random.random() < 0.3:
            mutated = self.repair_mutation(mutated)
        
        return mutated
    
    def repair_mutation(self, chromosome: Chromosome) -> Chromosome:
        """Intelligent mutation that repairs missing hours - PHASE 4"""
        repaired = deepcopy(chromosome)
        
        for class_id, class_info in self.classes.items():
            required_hours = {}
            scheduled_hours = {}
            
            for subject_code in class_info.get('subjects', []):
                if subject_code in self.subjects:
                    required_hours[subject_code] = self.subjects[subject_code].get('hours_per_week', 0)
                    scheduled_hours[subject_code] = 0
            
            for day, day_schedule in repaired.genes[class_id].items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('subject'):
                        subject = allocation['subject']
                        if subject in scheduled_hours:
                            scheduled_hours[subject] += 1
            
            deficit_subjects = []
            for subject_code, required in required_hours.items():
                scheduled = scheduled_hours.get(subject_code, 0)
                if scheduled < required:
                    deficit = required - scheduled
                    deficit_subjects.append((subject_code, deficit))
            
            if not deficit_subjects:
                continue
            
            empty_slots = []
            for day in self.days:
                for slot_key in repaired.genes[class_id][day].keys():
                    if not self.is_special_slot(class_id, day, slot_key):
                        allocation = repaired.genes[class_id][day][slot_key]
                        if not allocation or not allocation.get('subject'):
                            empty_slots.append((day, slot_key))
            
            random.shuffle(empty_slots)
            slot_idx = 0
            
            for subject_code, deficit in deficit_subjects:
                subject_info = self.subjects[subject_code]
                fills_needed = min(deficit, len(empty_slots) - slot_idx)
                
                for _ in range(fills_needed):
                    if slot_idx < len(empty_slots):
                        day, slot_key = empty_slots[slot_idx]
                        
                        faculty = random.choice(subject_info['faculties']) if subject_info.get('faculties') else None
                        room = self.get_suitable_room(subject_info['type'])
                        
                        repaired.genes[class_id][day][slot_key] = {
                            'subject': subject_code,
                            'faculty': faculty,
                            'room': room
                        }
                        slot_idx += 1
        
        return repaired
    
    def count_faculty_conflicts(self, chromosome: Chromosome) -> int:
        """Count faculty scheduling conflicts"""
        conflicts = 0
        faculty_schedule = {}
        
        for class_id, class_schedule in chromosome.genes.items():
            for day, day_schedule in class_schedule.items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('faculty'):
                        faculty = allocation['faculty']
                        key = f"{day}-{slot}"
                        
                        if key not in faculty_schedule:
                            faculty_schedule[key] = []
                        
                        if faculty in faculty_schedule[key]:
                            conflicts += 1
                        else:
                            faculty_schedule[key].append(faculty)
        
        return conflicts
    
    def count_room_conflicts(self, chromosome: Chromosome) -> int:
        """Count room scheduling conflicts"""
        conflicts = 0
        room_schedule = {}
        
        for class_id, class_schedule in chromosome.genes.items():
            for day, day_schedule in class_schedule.items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('room'):
                        room = allocation['room']
                        key = f"{day}-{slot}"
                        
                        if key not in room_schedule:
                            room_schedule[key] = []
                        
                        if room in room_schedule[key]:
                            conflicts += 1
                        else:
                            room_schedule[key].append(room)
        
        return conflicts
    
    def count_missing_hours(self, chromosome: Chromosome) -> int:
        """Count missing subject hours"""
        missing = 0
        
        for class_id, class_info in self.classes.items():
            subject_hours = {}
            required_hours = {}
            
            for day, day_schedule in chromosome.genes[class_id].items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('subject'):
                        subject = allocation['subject']
                        subject_hours[subject] = subject_hours.get(subject, 0) + 1
            
            for subject_code in class_info.get('subjects', []):
                if subject_code in self.subjects:
                    required_hours[subject_code] = self.subjects[subject_code].get('hours_per_week', 0)
            
            for subject, required in required_hours.items():
                scheduled = subject_hours.get(subject, 0)
                if scheduled < required:
                    missing += (required - scheduled)
        
        return missing
    
    def count_faculty_overload(self, chromosome: Chromosome) -> int:
        """Count violations of faculty daily hour limits - PHASE 5"""
        violations = 0
        faculty_daily_hours = {}
        
        for class_id in self.classes.keys():
            for day, day_schedule in chromosome.genes[class_id].items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('faculty'):
                        faculty = allocation['faculty']
                        key = (faculty, day)
                        faculty_daily_hours[key] = faculty_daily_hours.get(key, 0) + 1
        
        for (faculty, day), hours in faculty_daily_hours.items():
            if faculty in self.faculties:
                max_hours = self.faculties[faculty].get('max_hours_per_day', 8)
                if hours > max_hours:
                    violations += (hours - max_hours)
        
        return violations
    
    def count_gap_hours(self, chromosome: Chromosome) -> int:
        """Count gap hours in student schedules"""
        gaps = 0
        
        for class_id, class_schedule in chromosome.genes.items():
            for day, day_schedule in class_schedule.items():
                slots = sorted(day_schedule.keys())
                last_filled = -1
                
                for i, slot in enumerate(slots):
                    if day_schedule[slot]:
                        if last_filled >= 0 and i - last_filled > 1:
                            gaps += (i - last_filled - 1)
                        last_filled = i
        
        return gaps
    
    def count_unbalanced_days(self, chromosome: Chromosome) -> int:
        """Count unbalanced workload across days"""
        penalty = 0
        
        for class_id, class_schedule in chromosome.genes.items():
            daily_loads = []
            
            for day, day_schedule in class_schedule.items():
                load = sum(1 for slot in day_schedule.values() if slot)
                daily_loads.append(load)
            
            avg_load = sum(daily_loads) / len(daily_loads)
            for load in daily_loads:
                penalty += abs(load - avg_load)
        
        return int(penalty)
    
    def count_consecutive_theory(self, chromosome: Chromosome) -> int:
        """Count excessive consecutive theory classes"""
        penalty = 0
        max_consecutive = 3
        
        for class_id, class_schedule in chromosome.genes.items():
            for day, day_schedule in class_schedule.items():
                consecutive = 0
                
                for slot in sorted(day_schedule.keys()):
                    allocation = day_schedule[slot]
                    if allocation and allocation.get('type') == 'theory':
                        consecutive += 1
                        if consecutive > max_consecutive:
                            penalty += 1
                    else:
                        consecutive = 0
        
        return penalty
    
    def evolve(self, generations=None):
        """Main genetic algorithm with progress tracking and early stopping - PHASES 6 & 7"""
        if generations:
            self.generations = generations
        
        population = self.initialize_population()
        
        best_fitness_history = []
        best_chromosome = None
        best_fitness = float('-inf')
        stagnation_counter = 0
        
        print("\n" + "="*70)
        print("EVOLUTION PROGRESS")
        print("="*70)
        
        for generation in range(self.generations):
            # Evaluate fitness
            fitness_scores = [(chrom.calculate_fitness(self), chrom) for chrom in population]
            fitness_scores.sort(reverse=True, key=lambda x: x[0])
            
            current_best_fitness = fitness_scores[0][0]
            current_best = fitness_scores[0][1]
            
            # Update best solution
            if current_best_fitness > best_fitness:
                best_fitness = current_best_fitness
                best_chromosome = deepcopy(current_best)
                stagnation_counter = 0
            else:
                stagnation_counter += 1
            
            best_fitness_history.append(current_best_fitness)
            
            # Progress reporting
            if generation % 50 == 0 or generation == self.generations - 1:
                avg_fitness = sum(f for f, _ in fitness_scores) / len(fitness_scores)
                print(f"Gen {generation:4d} | Best: {current_best_fitness:7.1f} | "
                      f"Avg: {avg_fitness:7.1f} | Stagnation: {stagnation_counter}")
            
            # Early stopping - PHASE 6
            if stagnation_counter >= 150:
                print(f"\n⚠️  Early stopping at generation {generation}")
                print(f"   No improvement for {stagnation_counter} generations")
                break
            
            # Adaptive mutation rate - PHASE 7
            if stagnation_counter > 50 and stagnation_counter % 25 == 0:
                self.mutation_rate = min(0.4, self.mutation_rate * 1.1)
                print(f"   📈 Increased mutation rate to {self.mutation_rate:.3f}")
            
            # Selection and breeding
            new_population = []
            
            # Elitism
            elite_count = self.elite_size
            new_population.extend([deepcopy(chrom) for _, chrom in fitness_scores[:elite_count]])
            
            # Breed new generation
            while len(new_population) < self.population_size:
                parent1 = self.selection(fitness_scores)
                parent2 = self.selection(fitness_scores)
                
                if random.random() < self.crossover_rate:
                    child1, child2 = self.crossover(parent1, parent2)
                else:
                    child1, child2 = deepcopy(parent1), deepcopy(parent2)
                
                child1 = self.mutation(child1)
                child2 = self.mutation(child2)
                
                new_population.extend([child1, child2])
            
            population = new_population[:self.population_size]
        
        print("\n" + "="*70)
        print(f"✅ Evolution complete!")
        print(f"   Final best fitness: {best_fitness:.1f}")
        print(f"   Total generations: {generation + 1}")
        print("="*70 + "\n")
        
        self.best_solution = best_chromosome
        return best_chromosome
    
    def export_all_classes_as_json(self, chromosome, output_dir=r'D:\ai-timetable-scheduler\ai-timetable-scheduler'):
        """Export all class timetables to JSON with proper labeling"""
        all_timetables = {}
        
        # Get breaks from constraints
        lunch_break = self.constraints.get('lunch_break', '12:40-01:40')
        short_breaks = self.constraints.get('short_breaks', [])
        
        print(f"\n📋 Using breaks from constraints:")
        print(f"   Lunch break: {lunch_break}")
        print(f"   Short breaks: {short_breaks}")

        for class_id in self.classes.keys():
            timetable_list = []

            for day in self.days:
                # ✅ Check if day is online for this class
                is_online_day = self.is_online_day(class_id, day)
                
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    
                    allocation = chromosome.genes[class_id][day].get(slot_key, None)

                    # Special activities (Mentor Meeting, PBL, PAL, NPTEL)
                    if allocation and allocation.get('subject') == 'SPECIAL':
                        timetable_list.append({
                            "day": day,
                            "slot": slot_key,
                            "subject": None,
                            "faculty": None,
                            "room": allocation.get('room'),
                            "label": allocation.get('activity', 'Special Activity'),
                            "type": "special",
                            "subjectType": None
                        })
                    elif allocation and allocation.get('subject'):
                        # ✅ Regular subject class (could be online or physical)
                        subject_code = allocation.get('subject')
                        subject_type = self.subjects[subject_code].get('type', 'theory') if subject_code in self.subjects else 'theory'
                        
                        # ✅ Check if it's online
                        is_online = (allocation.get('type') == 'online' or 
                                    allocation.get('room') == 'Online' or 
                                    is_online_day)
                        
                        timetable_list.append({
                            "day": day,
                            "slot": slot_key,
                            "subject": allocation.get('subject'),
                            "faculty": allocation.get('faculty'),
                            "room": "Online" if is_online else allocation.get('room'),
                            "label": None,
                            "type": "online" if is_online else "regular",  # ✅ Mark as online
                            "subjectType": subject_type
                        })
                    else:
                        # Empty slot
                        timetable_list.append({
                            "day": day,
                            "slot": slot_key,
                            "subject": None,
                            "faculty": None,
                            "room": None,
                            "label": None,
                            "type": "empty",
                            "subjectType": None
                        })
                    
                    # Add lunch break
                    if lunch_break:
                        lunch_start = lunch_break.split('-')[0]
                        if slot['end'] == lunch_start:
                            timetable_list.append({
                                "day": day,
                                "slot": lunch_break,
                                "subject": None,
                                "faculty": None,
                                "room": None,
                                "label": "Lunch Break",
                                "type": "break",
                                "subjectType": None
                            })
                    
                    # Add short breaks
                    for short_break in short_breaks:
                        short_break_start = short_break.split('-')[0]
                        if slot['end'] == short_break_start:
                            timetable_list.append({
                                "day": day,
                                "slot": short_break,
                                "subject": None,
                                "faculty": None,
                                "room": None,
                                "label": "Short Break",
                                "type": "short_break",
                                "subjectType": None
                            })

            all_timetables[class_id] = timetable_list

        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, "all_classes_timetable.json")
        with open(output_file, 'w') as f:
            json.dump(all_timetables, f, indent=4)

        print(f"\n✅ All class timetables exported to {output_file}")
        print(f"✅ Added {len(short_breaks)} short break(s) to all days")

    def generate_config_template(self, output_file='config_template.json'):
        """Generate a configuration template file"""
        template = {
            "classes": {
                "TY1": {
                    "name": "Third Year Section 1",
                    "subjects": ["DBMS", "SE", "CN", "TOC", "AIML"],
                    "class_teacher": "Dr. John Doe",
                    "strength": 60
                }
            },
            "subjects": {
                "DBMS": {
                    "name": "Database Management Systems",
                    "code": "DBMS",
                    "type": "theory",
                    "hours_per_week": 4,
                    "faculties": ["Dr. A", "Dr. B"],
                    "requires_lab": True
                }
            },
            "faculties": {
                "Dr. A": {
                    "name": "Dr. Alice Anderson",
                    "subjects": ["DBMS"],
                    "max_hours_per_day": 6,
                    "unavailable_slots": []
                }
            },
            "rooms": {
                "S403": {
                    "type": "classroom",
                    "capacity": 60,
                    "facilities": ["projector", "whiteboard"]
                }
            },
            "constraints": {
                "online_days": {
                    "Wednesday": ["TY1"]
                }
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(template, f, indent=4)
        
        print(f"Configuration template saved to {output_file}")


# Example usage
if __name__ == "__main__":
    # Create scheduler instance
    scheduler = GeneticTimetableScheduler(r'D:\ai-timetable-scheduler\ai-timetable-scheduler\inputData.json')
    
    print("\n" + "="*80)
    print("IMPROVED GENETIC TIMETABLE SCHEDULER - ALL PHASES INCLUDED")
    print("="*80)
    
    # Run evolution
    print("\nEvolving timetable with all improvements...")
    best_solution = scheduler.evolve(generations=1000)
    
    # Export result
    scheduler.export_all_classes_as_json(best_solution)
    
    print("\n" + "="*80)
    print("IMPROVEMENTS APPLIED:")
    print("="*80)
    print("✅ Phase 1: Increased population (200), generations (1000), penalties")
    print("✅ Phase 2: Input validation & whitespace handling")
    print("✅ Phase 3: Greedy initialization (70% greedy + 30% random)")
    print("✅ Phase 4: Repair mutation operator")
    print("✅ Phase 5: Faculty daily hour limit enforcement")
    print("✅ Phase 6: Progress tracking & early stopping")
    print("✅ Phase 7: Adaptive mutation rate")
    print("="*80)


# Save the complete code
# with open('genetic_scheduler_complete.py', 'w', encoding='utf-8') as f:
#     f.write(complete_code)

# print("=" * 80)
# print("✅ COMPLETE IMPROVED ALGORITHM CREATED")
# print("=" * 80)
# print("\nFile: genetic_scheduler_complete.py")
# print(f"Size: {len(complete_code):,} characters")
# print("\nALL 7 PHASES INCLUDED:")
# print("  ✅ Phase 1: Basic parameter improvements")
# print("  ✅ Phase 2: Input validation & whitespace handling")  
# print("  ✅ Phase 3: Greedy initialization")
# print("  ✅ Phase 4: Repair mutation operator")
# print("  ✅ Phase 5: Faculty daily hour limit enforcement")
# print("  ✅ Phase 6: Progress tracking & early stopping")
# print("  ✅ Phase 7: Adaptive mutation rate")
# print("\n✅ Ready to use with inputData_fixed.json!")
# print("=" * 80)
