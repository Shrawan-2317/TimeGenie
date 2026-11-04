
# TimeGenie – AI Timetable Scheduler

An intelligent timetable scheduling system built using **Genetic Algorithm (GA)** to generate optimized academic timetables while considering faculty availability, classroom allocation, subject requirements, and institutional constraints.

Developed for **MIT School of Computing**.

## Overview

Creating academic timetables manually can be time-consuming and challenging, especially when multiple classes, faculty members, subjects, and classrooms need to be coordinated.

**TimeGenie** addresses this problem using a Genetic Algorithm that explores different timetable combinations and selects solutions based on a fitness function.

The system aims to minimize scheduling conflicts, ensure required subject hours, and create balanced weekly schedules.

## Key Features

- **Automated Timetable Generation:** Generates academic timetables using Genetic Algorithm optimization.
- **Faculty Conflict Management:** Penalizes scheduling conflicts involving faculty members.
- **Classroom Allocation:** Assigns suitable classrooms and laboratories.
- **Subject Hour Management:** Considers the required weekly hours for each subject.
- **Balanced Scheduling:** Reduces unnecessary gaps and uneven daily workloads.
- **Special Time Slots:** Supports predefined activities and online-day schedules.
- **Multiple Output Formats:** Exports generated timetables into CSV and PDF formats.
- **Configurable Scheduling:** Allows institutions to customize classes, subjects, faculty, rooms, and constraints.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core implementation |
| NumPy | Numerical operations |
| Pandas | Timetable data handling |
| Genetic Algorithm | Timetable optimization |
| ReportLab | PDF generation |
| JSON | Configuration management |

## How It Works

TimeGenie uses a Genetic Algorithm to find suitable timetable arrangements.

The optimization process consists of the following stages:

1. **Population Initialization:** Creates an initial population of candidate timetables.
2. **Fitness Evaluation:** Evaluates each timetable using hard and soft constraint penalties.
3. **Selection:** Uses tournament selection to choose better-performing solutions.
4. **Crossover:** Combines timetable structures from selected parent solutions.
5. **Mutation:** Introduces small changes to explore alternative schedules.
6. **Elitism:** Preserves the best-performing solutions across generations.
7. **Final Output:** Selects the best timetable and exports it into CSV and PDF formats.

### Fitness Function

The fitness function starts with a base score of 1000 and subtracts penalties for constraint violations.

| Constraint | Penalty |
|---|---:|
| Faculty conflicts | 50 |
| Room conflicts | 50 |
| Missing subject hours | 30 |
| Gap hours | 5 |
| Unbalanced daily workload | 10 |
| Excessive consecutive theory classes | 3 |

A higher fitness score represents a better timetable according to the defined evaluation criteria.

### Genetic Algorithm Parameters

| Parameter | Value |
|---|---:|
| Population Size | 100 |
| Generations | 500 |
| Mutation Rate | 0.10 |
| Crossover Rate | 0.80 |
| Elite Size | 10 |

## Project Structure

```text
TimeGenie/
│
├── ai-timetable-scheduler/
├── config/
├── output/
│   ├── csv/
│   └── timetables/
│
├── genetic_scheduler.py
├── main.py
├── pdf_generator.py
├── timetable_config.json
├── requirements.txt.txt
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shrawan-2317/TimeGenie.git
cd TimeGenie
```

### 2. Install Dependencies

Make sure Python 3.8 or above is installed.

```bash
pip install -r requirements.txt.txt
```

### 3. Generate Configuration

Run the main application:

```bash
python main.py
```

The application generates a configuration template at:

```text
config/timetable_config.json
```

Choose `n` when prompted if you want to configure your own institutional data first.

### 4. Configure Your Timetable

Update the generated JSON configuration with your institution's:

- Classes and sections
- Subjects and weekly hours
- Faculty information
- Classroom and laboratory details
- Scheduling constraints

### 5. Generate Timetables

Run the scheduler using your configuration:

```bash
python main.py --run
```

The Genetic Algorithm will optimize the timetable and generate the output files.

## Output

Generated timetables are exported in two formats:

- **CSV:** Structured timetable data for further analysis and editing.
- **PDF:** Formatted timetable documents for easy viewing and sharing.

Output directories:

```text
output/
├── csv/
└── timetables/
```

## Future Improvements

- Develop a web-based interface for timetable management.
- Add interactive timetable visualization.
- Improve optimization for larger institutions.
- Introduce additional scheduling constraints.
- Support timetable modification and regeneration through an administrative dashboard.

## Author

**Shrawan Mokale**

Computer Science and Engineering  
MIT ADT University

[GitHub Profile](https://github.com/Shrawan-2317)

---

*TimeGenie – Making academic scheduling smarter, simpler, and more efficient.*
