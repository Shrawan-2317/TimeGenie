import json
from genetic_scheduler import GeneticTimetableScheduler
import sys

def generate(class_id="TY1", generations=300):
    input_file = r"D:\ai-timetable-scheduler\ai-timetable-scheduler\data\inputData.json"
    scheduler = GeneticTimetableScheduler(config_file=input_file)

    # Run GA
    best_solution = scheduler.evolve(generations=generations)

    # Convert output to frontend-friendly slots
    df = scheduler.export_to_dataframe(best_solution, class_id)
    slots = []
    for _, row in df.iterrows():
        day = row['Day']
        for col in df.columns:
            if col != 'Day':
                value = row[col]
                if value == "-":
                    slots.append({"day": day, "slot": col, "subject": None, "faculty": None, "room": None})
                else:
                    parts = value.split("\n")
                    slots.append({
                        "day": day,
                        "slot": col,
                        "subject": parts[0] if len(parts) > 0 else None,
                        "faculty": parts[1] if len(parts) > 1 else None,
                        "room": parts[2] if len(parts) > 2 else None
                    })

    result = {
        "success": True,
        "slots": slots,
        "version": "1.0",
        "metrics": {"conflicts": 0, "soft_score": 0}
    }
    return result

if __name__ == "__main__":
    # Optional: allow passing class_id and generations from command line
    class_id = sys.argv[1] if len(sys.argv) > 1 else "TY1"
    generations = int(sys.argv[2]) if len(sys.argv) > 2 else 300

    output = generate(class_id=class_id, generations=generations)
    print(json.dumps(output))
