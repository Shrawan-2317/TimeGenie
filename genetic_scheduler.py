import numpy as np
import pandas as pd
from typing import List, Dict, Tuple
import random
from copy import deepcopy
import json

class GeneticTimetableScheduler:
    """
    Genetic Algorithm based timetable scheduler that handles complex constraints
    similar to MIT SOC timetables
    """
    
    def __init__(self, config_file=None):
        # GA Parameters
        self.population_size = 100
        self.generations = 500
        self.mutation_rate = 0.1
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
        
        if config_file:
            self.load_config(config_file)
    
    def load_config(self, config_file):
        """Load configuration from JSON file"""
        with open(config_file, 'r') as f:
            config = json.load(f)
            self.classes = config.get('classes', {})
            self.subjects = config.get('subjects', {})
            self.faculties = config.get('faculties', {})
            self.rooms = config.get('rooms', {})
            self.constraints = config.get('constraints', {})
    
    class Chromosome:
        """Represents a complete timetable solution"""
        def __init__(self, genes=None):
            self.genes = genes if genes else {}  # class -> day -> slot -> allocation
            self.fitness = 0
        
        def calculate_fitness(self, scheduler):
            """Calculate fitness score for the chromosome"""
            fitness = 1000  # Start with max fitness
            
            # Penalty for hard constraint violations
            fitness -= scheduler.count_faculty_conflicts(self) * 50
            fitness -= scheduler.count_room_conflicts(self) * 50
            fitness -= scheduler.count_missing_hours(self) * 30
            
            # Penalty for soft constraint violations
            fitness -= scheduler.count_gap_hours(self) * 5
            fitness -= scheduler.count_unbalanced_days(self) * 10
            fitness -= scheduler.count_consecutive_theory(self) * 3
            
            self.fitness = max(0, fitness)
            return self.fitness
    
    def initialize_population(self) -> List[Chromosome]:
        """Create initial population of random valid timetables"""
        population = []
        
        for _ in range(self.population_size):
            chromosome = self.create_random_chromosome()
            chromosome.calculate_fitness(self)
            population.append(chromosome)
        
        return population
    
    def create_random_chromosome(self) -> Chromosome:
        """Create a random but valid chromosome"""
        genes = {}
        
        for class_id, class_info in self.classes.items():
            genes[class_id] = {}
            
            for day in self.days:
                genes[class_id][day] = {}
                
                for slot in self.time_slots:
                    slot_key = f"{slot['start']}-{slot['end']}"
                    
                    # Handle special slots
                    if self.is_special_slot(class_id, day, slot_key):
                        genes[class_id][day][slot_key] = self.get_special_allocation(class_id, day, slot_key)
                    else:
                        # Randomly assign from available subjects
                        if random.random() > 0.3:  # 70% chance of filling slot
                            subject = self.get_random_subject_for_class(class_id)
                            if subject:
                                genes[class_id][day][slot_key] = {
                                    'subject': subject['code'],
                                    'faculty': random.choice(subject['faculties']),
                                    'room': self.get_suitable_room(subject),
                                    'type': subject['type']
                                }
                        else:
                            genes[class_id][day][slot_key] = None
        
        return self.Chromosome(genes)
    
    def is_special_slot(self, class_id, day, slot):
        """Check if slot is reserved for special activities"""
        special_slots = {
            'Monday': {'03:40-04:30': 'Mentor Meeting'},
            'Saturday': {'08:45-09:40': 'PBL Review', '09:40-10:35': 'PAL'},
            'Friday': {'03:40-04:30': 'NPTEL'}
        }
        
        if day in special_slots and slot in special_slots[day]:
            return True
        
        # Check for online day patterns
        if self.is_online_day(class_id, day):
            return True
        
        return False
    
    def get_special_allocation(self, class_id, day, slot):
        """Get special allocation for reserved slots"""
        return {
            'subject': 'SPECIAL',
            'activity': 'Mentor Meeting',  # or other special activity
            'faculty': None,
            'room': 'Online' if self.is_online_day(class_id, day) else None
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
    
    def get_suitable_room(self, subject):
        """Get suitable room for subject type"""
        if subject['type'] == 'lab':
            lab_rooms = [r for r, info in self.rooms.items() if info['type'] == 'lab']
            return random.choice(lab_rooms) if lab_rooms else 'TBD'
        else:
            class_rooms = [r for r, info in self.rooms.items() if info['type'] == 'classroom']
            return random.choice(class_rooms) if class_rooms else 'TBD'
    
    def selection(self, population: List[Chromosome]) -> List[Chromosome]:
        """Tournament selection"""
        selected = []
        tournament_size = 5
        
        for _ in range(len(population)):
            tournament = random.sample(population, tournament_size)
            winner = max(tournament, key=lambda x: x.fitness)
            selected.append(deepcopy(winner))
        
        return selected
    
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
        """Mutation operator"""
        if random.random() > self.mutation_rate:
            return chromosome
        
        mutated = deepcopy(chromosome)
        
        # Select random class, day, and slot to mutate
        class_id = random.choice(list(mutated.genes.keys()))
        day = random.choice(list(mutated.genes[class_id].keys()))
        slot = random.choice(list(mutated.genes[class_id][day].keys()))
        
        # Don't mutate special slots
        if not self.is_special_slot(class_id, day, slot):
            # Either swap with another slot or change the subject
            if random.random() > 0.5:
                # Swap with another slot
                other_day = random.choice(list(mutated.genes[class_id].keys()))
                other_slot = random.choice(list(mutated.genes[class_id][other_day].keys()))
                
                if not self.is_special_slot(class_id, other_day, other_slot):
                    temp = mutated.genes[class_id][day][slot]
                    mutated.genes[class_id][day][slot] = mutated.genes[class_id][other_day][other_slot]
                    mutated.genes[class_id][other_day][other_slot] = temp
            else:
                # Change the subject
                subject = self.get_random_subject_for_class(class_id)
                if subject:
                    mutated.genes[class_id][day][slot] = {
                        'subject': subject['code'],
                        'faculty': random.choice(subject['faculties']),
                        'room': self.get_suitable_room(subject),
                        'type': subject['type']
                    }
        
        return mutated
    
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
            
            # Count scheduled hours
            for day, day_schedule in chromosome.genes[class_id].items():
                for slot, allocation in day_schedule.items():
                    if allocation and allocation.get('subject'):
                        subject = allocation['subject']
                        subject_hours[subject] = subject_hours.get(subject, 0) + 1
            
            # Get required hours
            for subject_code in class_info.get('subjects', []):
                if subject_code in self.subjects:
                    required_hours[subject_code] = self.subjects[subject_code].get('hours_per_week', 0)
            
            # Calculate missing hours
            for subject, required in required_hours.items():
                scheduled = subject_hours.get(subject, 0)
                if scheduled < required:
                    missing += (required - scheduled)
        
        return missing
    
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
        """Main genetic algorithm evolution process"""
        if generations:
            self.generations = generations
        
        # Initialize population
        population = self.initialize_population()
        best_chromosome = max(population, key=lambda x: x.fitness)
        
        for generation in range(self.generations):
            # Sort population by fitness
            population.sort(key=lambda x: x.fitness, reverse=True)
            
            # Elite preservation
            new_population = population[:self.elite_size]
            
            # Generate offspring
            while len(new_population) < self.population_size:
                # Selection
                parents = self.selection(population)
                
                # Crossover
                parent1, parent2 = random.sample(parents[:20], 2)
                child1, child2 = self.crossover(parent1, parent2)
                # Crossover
                parent1, parent2 = random.sample(parents[:20], 2)
                child1, child2 = self.crossover(parent1, parent2)
                
                # Mutation
                child1 = self.mutation(child1)
                child2 = self.mutation(child2)
                
                # Calculate fitness
                child1.calculate_fitness(self)
                child2.calculate_fitness(self)
                
                # Add to new population
                new_population.extend([child1, child2])
            
            # Trim to population size
            population = new_population[:self.population_size]
            
            # Track best solution
            current_best = max(population, key=lambda x: x.fitness)
            if current_best.fitness > best_chromosome.fitness:
                best_chromosome = deepcopy(current_best)
            
            # Print progress
            if generation % 50 == 0:
                print(f"Generation {generation}: Best Fitness = {best_chromosome.fitness}")
        
        return best_chromosome
    
    def export_to_dataframe(self, chromosome: Chromosome, class_id: str) -> pd.DataFrame:
        """Export timetable for a specific class to DataFrame"""
        data = []
        
        for day in self.days:
            row = {'Day': day}
            
            for slot in self.time_slots:
                slot_key = f"{slot['start']}-{slot['end']}"
                allocation = chromosome.genes[class_id][day][slot_key]
                
                if allocation:
                    if allocation.get('subject') == 'SPECIAL':
                        cell_value = allocation.get('activity', 'Special')
                    else:
                        subject = allocation.get('subject', '')
                        faculty = allocation.get('faculty', '')
                        room = allocation.get('room', '')
                        cell_value = f"{subject}\n{faculty}\n{room}"
                else:
                    cell_value = '-'
                
                row[slot_key] = cell_value
            
            data.append(row)
        
        df = pd.DataFrame(data)
        return df
    
    def export_all_timetables(self, chromosome: Chromosome, output_dir='timetables'):
        """Export all class timetables to CSV files"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        for class_id in self.classes.keys():
            df = self.export_to_dataframe(chromosome, class_id)
            filename = f"{output_dir}/{class_id}_timetable.csv"
            df.to_csv(filename, index=False)
            print(f"Exported timetable for {class_id} to {filename}")
    
    def visualize_timetable(self, chromosome: Chromosome, class_id: str):
        """Print timetable in a formatted way"""
        print(f"\n{'='*80}")
        print(f"TIMETABLE FOR {class_id}")
        print(f"{'='*80}\n")
        
        df = self.export_to_dataframe(chromosome, class_id)
        print(df.to_string(index=False))
        print(f"\nFitness Score: {chromosome.fitness}")
    
    def generate_config_template(self, output_file='config_template.json'):
        """Generate a configuration template file"""
        template = {
            "classes": {
                "TY1": {
                    "name": "Third Year Section 1",
                    "subjects": ["DBMS", "SE", "CN", "TOC", "AIML"],
                    "class_teacher": "Dr. John Doe",
                    "strength": 60
                },
                "TY2": {
                    "name": "Third Year Section 2",
                    "subjects": ["DBMS", "SE", "CN", "TOC", "AIML"],
                    "class_teacher": "Dr. Jane Smith",
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
                },
                "SE": {
                    "name": "Software Engineering",
                    "code": "SE",
                    "type": "theory",
                    "hours_per_week": 4,
                    "faculties": ["Dr. C", "Dr. D"],
                    "requires_lab": False
                },
                "CN": {
                    "name": "Computer Networks",
                    "code": "CN",
                    "type": "theory",
                    "hours_per_week": 3,
                    "faculties": ["Dr. E"],
                    "requires_lab": True
                },
                "TOC": {
                    "name": "Theory of Computation",
                    "code": "TOC",
                    "type": "theory",
                    "hours_per_week": 3,
                    "faculties": ["Dr. F"],
                    "requires_lab": False
                },
                "AIML": {
                    "name": "Artificial Intelligence & Machine Learning",
                    "code": "AIML",
                    "type": "theory",
                    "hours_per_week": 4,
                    "faculties": ["Dr. G", "Dr. H"],
                    "requires_lab": True
                },
                "DBMS_LAB": {
                    "name": "DBMS Laboratory",
                    "code": "DBMS_LAB",
                    "type": "lab",
                    "hours_per_week": 2,
                    "faculties": ["Dr. A", "Dr. B"],
                    "duration": 2
                }
            },
            "faculties": {
                "Dr. A": {
                    "name": "Dr. Alice Anderson",
                    "subjects": ["DBMS", "DBMS_LAB"],
                    "max_hours_per_day": 6,
                    "unavailable_slots": []
                },
                "Dr. B": {
                    "name": "Dr. Bob Brown",
                    "subjects": ["DBMS", "DBMS_LAB"],
                    "max_hours_per_day": 6,
                    "unavailable_slots": []
                }
            },
            "rooms": {
                "S403": {
                    "type": "classroom",
                    "capacity": 60,
                    "facilities": ["projector", "whiteboard"]
                },
                "N511": {
                    "type": "classroom",
                    "capacity": 60,
                    "facilities": ["projector", "whiteboard"]
                },
                "LAB1": {
                    "type": "lab",
                    "capacity": 30,
                    "facilities": ["computers", "projector"]
                },
                "LAB2": {
                    "type": "lab",
                    "capacity": 30,
                    "facilities": ["computers", "projector"]
                }
            },
            "constraints": {
                "online_days": {
                    "Wednesday": ["TY1"],
                    "Thursday": ["TY2"]
                },
                "special_slots": {
                    "Monday": {
                        "03:40-04:30": "Mentor Meeting"
                    },
                    "Saturday": {
                        "08:45-09:40": "PBL Review",
                        "09:40-10:35": "PAL"
                    },
                    "Friday": {
                        "03:40-04:30": "NPTEL"
                    }
                },
                "max_hours_per_day": 7,
                "max_consecutive_theory": 3,
                "lunch_break": "12:40-01:40"
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(template, f, indent=4)
        
        print(f"Configuration template saved to {output_file}")


# Example usage
if __name__ == "__main__":
    # Create scheduler instance
    scheduler = GeneticTimetableScheduler()
    
    # Generate configuration template
    scheduler.generate_config_template('timetable_config.json')
    
    print("\n" + "="*80)
    print("Configuration template generated!")
    print("="*80)
    print("\nNext steps:")
    print("1. Edit 'timetable_config.json' with your college data")
    print("2. Run the scheduler:")
    print("   scheduler = GeneticTimetableScheduler('timetable_config.json')")
    print("   best_solution = scheduler.evolve(generations=500)")
    print("   scheduler.visualize_timetable(best_solution, 'TY1')")
    print("   scheduler.export_all_timetables(best_solution)")
    print("\n" + "="*80)
    
    # Example with dummy data
    print("\nRunning example with dummy data...")
    
    # Set up dummy data
    scheduler.classes = {
        "TY1": {
            "name": "Third Year Section 1",
            "subjects": ["DBMS", "SE", "CN"],
            "class_teacher": "Dr. John Doe"
        }
    }
    
    scheduler.subjects = {
        "DBMS": {
            "name": "Database Management Systems",
            "code": "DBMS",
            "type": "theory",
            "hours_per_week": 4,
            "faculties": ["Dr. A", "Dr. B"]
        },
        "SE": {
            "name": "Software Engineering",
            "code": "SE",
            "type": "theory",
            "hours_per_week": 3,
            "faculties": ["Dr. C"]
        },
        "CN": {
            "name": "Computer Networks",
            "code": "CN",
            "type": "theory",
            "hours_per_week": 3,
            "faculties": ["Dr. D"]
        }
    }
    
    scheduler.rooms = {
        "S403": {"type": "classroom", "capacity": 60},
        "N511": {"type": "classroom", "capacity": 60}
    }
    
    # Run evolution
    print("\nEvolving timetable...")
    best_solution = scheduler.evolve(generations=100)
    
    # Visualize result
    scheduler.visualize_timetable(best_solution, "TY1")