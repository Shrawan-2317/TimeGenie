from genetic_scheduler import GeneticTimetableScheduler
from pdf_generator import TimetablePDFGenerator
import os

def setup_project():
    """Setup project directories"""
    os.makedirs('config', exist_ok=True)
    os.makedirs('input', exist_ok=True)
    os.makedirs('output/timetables', exist_ok=True)
    os.makedirs('output/csv', exist_ok=True)
    print("✓ Project directories created")

def main():
    print("="*70)
    print(" AI-BASED TIMETABLE SCHEDULER - MIT SOC")
    print("="*70)
    
    # Setup directories
    setup_project()
    
    # Step 1: Generate configuration template
    print("\n[Step 1] Generating configuration template...")
    scheduler = GeneticTimetableScheduler()
    scheduler.generate_config_template('config/timetable_config.json')
    print("✓ Configuration template created at config/timetable_config.json")
    print("\n⚠️  IMPORTANT: Edit config/timetable_config.json with your college data!")
    print("   Then run this script again with your config.\n")
    
    # Ask user if they want to continue with dummy data or stop
    choice = input("Continue with dummy data for demo? (y/n): ").lower()
    
    if choice != 'y':
        print("\nPlease edit the config file and run: python main.py --run")
        return
    
    # Step 2: Run with dummy data for demonstration
    print("\n[Step 2] Running with dummy data for demonstration...")
    
    # Setup dummy data
    scheduler.classes = {
        "TY1": {
            "name": "Third Year Section 1",
            "subjects": ["DBMS", "SE", "CN", "TOC"],
            "class_teacher": "Dr. John Doe",
            "teacher_contact": "john.doe@mit.edu",
            "strength": 60
        },
        "TY2": {
            "name": "Third Year Section 2",
            "subjects": ["DBMS", "SE", "CN", "TOC"],
            "class_teacher": "Dr. Jane Smith",
            "teacher_contact": "jane.smith@mit.edu",
            "strength": 60
        }
    }
    
    scheduler.subjects = {
        "DBMS": {
            "name": "Database Management Systems",
            "code": "DBMS",
            "type": "theory",
            "hours_per_week": 4,
            "faculties": ["Dr. Alice", "Dr. Bob"]
        },
        "SE": {
            "name": "Software Engineering",
            "code": "SE",
            "type": "theory",
            "hours_per_week": 4,
            "faculties": ["Dr. Charlie"]
        },
        "CN": {
            "name": "Computer Networks",
            "code": "CN",
            "type": "theory",
            "hours_per_week": 3,
            "faculties": ["Dr. David"]
        },
        "TOC": {
            "name": "Theory of Computation",
            "code": "TOC",
            "type": "theory",
            "hours_per_week": 3,
            "faculties": ["Dr. Eve"]
        }
    }
    
    scheduler.rooms = {
        "S403": {"type": "classroom", "capacity": 60},
        "N511": {"type": "classroom", "capacity": 60},
        "S404": {"type": "classroom", "capacity": 60}
    }
    
    scheduler.constraints = {
        "online_days": {
            "Wednesday": ["TY1"]
        }
    }
    
    # Step 3: Run Genetic Algorithm
    print("\n[Step 3] Running Genetic Algorithm (this may take a minute)...")
    best_solution = scheduler.evolve(generations=200)
    print(f"\n✓ Best solution found with fitness: {best_solution.fitness}")
    
    # Step 4: Visualize timetable
    print("\n[Step 4] Visualizing timetables...")
    for class_id in scheduler.classes.keys():
        scheduler.visualize_timetable(best_solution, class_id)
    
    # Step 5: Export to CSV
    print("\n[Step 5] Exporting to CSV...")
    scheduler.export_all_timetables(best_solution, 'output/csv')
    
    # Step 6: Generate PDF
    print("\n[Step 6] Generating PDF timetables...")
    pdf_gen = TimetablePDFGenerator(scheduler, best_solution)
    pdf_files = pdf_gen.generate_all_pdfs('output/timetables')
    
    print("\n" + "="*70)
    print(" GENERATION COMPLETE!")
    print("="*70)
    print(f"\nGenerated files:")
    print(f"  📄 CSV files: output/csv/")
    print(f"  📄 PDF files: output/timetables/")
    print(f"\n✓ Total timetables generated: {len(pdf_files)}")
    print("="*70)

def run_with_config():
    """Run with actual configuration file"""
    print("="*70)
    print(" Running with configuration file")
    print("="*70)
    
    config_path = 'config/timetable_config.json'
    
    if not os.path.exists(config_path):
        print(f"❌ Error: {config_path} not found!")
        print("   Run without --run flag first to generate template.")
        return
    
    # Load scheduler with config
    print(f"\n[1] Loading configuration from {config_path}...")
    scheduler = GeneticTimetableScheduler(config_path)
    print("✓ Configuration loaded")
    
    # Run GA
    print("\n[2] Running Genetic Algorithm...")
    best_solution = scheduler.evolve(generations=500)
    print(f"✓ Best solution: Fitness = {best_solution.fitness}")
    
    # Export CSV
    print("\n[3] Exporting CSV files...")
    scheduler.export_all_timetables(best_solution, 'output/csv')
    
    # Generate PDFs
    print("\n[4] Generating PDF timetables...")
    pdf_gen = TimetablePDFGenerator(scheduler, best_solution)
    pdf_files = pdf_gen.generate_all_pdfs('output/timetables')
    
    print("\n" + "="*70)
    print(" COMPLETE!")
    print("="*70)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--run':
        run_with_config()
    else:
        main()