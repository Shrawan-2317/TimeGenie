from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from datetime import datetime
import json

class TimetablePDFGenerator:
    """
    Generates MIT SOC style timetable PDFs from chromosome data
    """
    
    def __init__(self, scheduler, chromosome):
        self.scheduler = scheduler
        self.chromosome = chromosome
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
        
    def setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Header style
        self.header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Heading1'],
            fontSize=16,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Subheader style
        self.subheader_style = ParagraphStyle(
            'CustomSubHeader',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor=colors.HexColor('#333333'),
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica'
        )
        
        # Cell content style
        self.cell_style = ParagraphStyle(
            'CellContent',
            parent=self.styles['Normal'],
            fontSize=8,
            leading=10,
            alignment=TA_CENTER,
            fontName='Helvetica'
        )
        
        # Cell faculty style (smaller)
        self.faculty_style = ParagraphStyle(
            'FacultyContent',
            parent=self.styles['Normal'],
            fontSize=7,
            leading=9,
            alignment=TA_CENTER,
            fontName='Helvetica',
            textColor=colors.HexColor('#555555')
        )
        
        # Footer style
        self.footer_style = ParagraphStyle(
            'Footer',
            parent=self.styles['Normal'],
            fontSize=8,
            alignment=TA_LEFT,
            fontName='Helvetica-Oblique'
        )
    
    def create_header_data(self, class_id, class_info):
        """Create header information for the timetable"""
        header_lines = []
        
        # Institution name
        header_lines.append(Paragraph(
            "<b>MIT SCHOOL OF COMPUTING</b>",
            self.header_style
        ))
        
        # Class and semester info
        semester_info = f"Time Table for {class_info.get('name', class_id)} - Semester I (2025-26)"
        header_lines.append(Paragraph(semester_info, self.subheader_style))
        
        # Class teacher info
        if 'class_teacher' in class_info:
            teacher_info = f"Class Teacher: {class_info['class_teacher']}"
            if 'teacher_contact' in class_info:
                teacher_info += f" | Contact: {class_info['teacher_contact']}"
            header_lines.append(Paragraph(teacher_info, self.footer_style))
        
        header_lines.append(Spacer(1, 0.2*inch))
        
        return header_lines
    
    def format_cell_content(self, allocation, slot_duration=1):
        """Format cell content with subject, faculty, and room"""
        if not allocation:
            return Paragraph("-", self.cell_style)
        
        content_parts = []
        
        # Special activities
        if allocation.get('subject') == 'SPECIAL':
            activity = allocation.get('activity', 'Special Activity')
            return Paragraph(f"<b>{activity}</b>", self.cell_style)
        
        # Regular classes
        subject = allocation.get('subject', '')
        faculty = allocation.get('faculty', '')
        room = allocation.get('room', '')
        
        # Subject name (bold)
        if subject:
            content_parts.append(f"<b>{subject}</b>")
        
        # Faculty name
        if faculty:
            content_parts.append(f"<font size=7 color='#555555'>{faculty}</font>")
        
        # Room number
        if room and room != 'TBD':
            content_parts.append(f"<font size=7 color='#666666'>{room}</font>")
        
        # Combine with line breaks
        content = "<br/>".join(content_parts)
        
        return Paragraph(content, self.cell_style)
    
    def create_timetable_table(self, class_id):
        """Create the main timetable table"""
        # Table headers
        time_slots = self.scheduler.time_slots
        headers = ['Day/Time']
        
        for slot in time_slots:
            time_header = f"{slot['start']}<br/>to<br/>{slot['end']}"
            headers.append(Paragraph(time_header, self.cell_style))
        
        # Add break columns
        break_slots = [
            ('10:35-10:50', 'Short Break'),
            ('12:40-01:40', 'Lunch Break'),
            ('03:30-03:40', 'Short Break')
        ]
        
        table_data = [headers]
        
        # Days data
        for day in self.scheduler.days:
            row = [Paragraph(f"<b>{day}</b>", self.cell_style)]
            
            day_schedule = self.chromosome.genes[class_id][day]
            slot_index = 0
            
            for slot in time_slots:
                slot_key = f"{slot['start']}-{slot['end']}"
                
                # Check if there's a break before this slot
                for break_time, break_name in break_slots:
                    if slot['start'] == break_time.split('-')[1]:
                        row.append(Paragraph(f"<i>{break_name}</i>", self.cell_style))
                
                allocation = day_schedule.get(slot_key)
                row.append(self.format_cell_content(allocation))
                slot_index += 1
            
            table_data.append(row)
        
        # Calculate column widths
        available_width = 10.5 * inch  # landscape A4 width minus margins
        day_col_width = 0.8 * inch
        slot_col_width = (available_width - day_col_width) / len(time_slots)
        
        col_widths = [day_col_width] + [slot_col_width] * len(time_slots)
        
        # Create table
        table = Table(table_data, colWidths=col_widths, repeatRows=1)
        
        # Table styling
        table_style = TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4472C4')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            
            # Day column (first column)
            ('BACKGROUND', (0, 1), (0, -1), colors.HexColor('#E7E6E6')),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            
            # Grid
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.black),
            
            # Cell padding
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
            
            # Alternate row colors
            ('ROWBACKGROUNDS', (1, 1), (-1, -1), [colors.white, colors.HexColor('#F8F9FA')]),
        ])
        
        # Highlight special slots (online days, special activities)
        row_num = 1
        for day in self.scheduler.days:
            if self.scheduler.is_online_day(class_id, day):
                table_style.add('BACKGROUND', (1, row_num), (-1, row_num), colors.HexColor('#FFF4E6'))
            row_num += 1
        
        table.setStyle(table_style)
        
        return table
    
    def create_legend(self):
        """Create legend for the timetable"""
        legend_data = [
            [Paragraph("<b>Legend:</b>", self.cell_style)],
            [Paragraph("Theory Classes: Regular slots", self.footer_style)],
            [Paragraph("Lab Classes: 2-hour duration slots", self.footer_style)],
            [Paragraph("Online Classes: Light orange background", self.footer_style)],
            [Paragraph("Special Activities: Mentor Meeting, PBL, PAL, NPTEL", self.footer_style)]
        ]
        
        legend_table = Table(legend_data, colWidths=[7*inch])
        legend_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        
        return legend_table
    
    def create_subject_list(self, class_id):
        """Create list of subjects for the class"""
        class_info = self.scheduler.classes[class_id]
        subjects = class_info.get('subjects', [])
        
        subject_data = [[Paragraph("<b>Subjects:</b>", self.cell_style)]]
        
        for subject_code in subjects:
            if subject_code in self.scheduler.subjects:
                subject = self.scheduler.subjects[subject_code]
                subject_name = subject.get('name', subject_code)
                subject_type = subject.get('type', 'theory').upper()
                hours = subject.get('hours_per_week', 0)
                
                faculties = ", ".join(subject.get('faculties', []))
                
                subject_text = f"{subject_code}: {subject_name} ({subject_type}, {hours}hrs/week) - {faculties}"
                subject_data.append([Paragraph(subject_text, self.footer_style)])
        
        subject_table = Table(subject_data, colWidths=[7*inch])
        subject_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        
        return subject_table
    
    def add_footer(self, canvas, doc):
        """Add footer to each page"""
        canvas.saveState()
        
        # Footer text
        footer_text = f"Generated on {datetime.now().strftime('%d-%m-%Y %H:%M')} | Fitness Score: {self.chromosome.fitness}"
        canvas.setFont('Helvetica', 8)
        canvas.drawString(0.5*inch, 0.3*inch, footer_text)
        
        # Page number
        page_num = canvas.getPageNumber()
        canvas.drawRightString(11*inch - 0.5*inch, 0.3*inch, f"Page {page_num}")
        
        canvas.restoreState()
    
    def generate_pdf(self, class_id, filename=None):
        """Generate PDF for a specific class"""
        if filename is None:
            filename = f"timetable_{class_id}.pdf"
        
        # Create PDF document
        doc = SimpleDocTemplate(
            filename,
            pagesize=landscape(A4),
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.75*inch,
            bottomMargin=0.5*inch
        )
        
        # Build document elements
        elements = []
        
        # Header
        class_info = self.scheduler.classes.get(class_id, {})
        elements.extend(self.create_header_data(class_id, class_info))
        
        # Main timetable
        elements.append(self.create_timetable_table(class_id))
        elements.append(Spacer(1, 0.3*inch))
        
        # Subject list
        elements.append(self.create_subject_list(class_id))
        elements.append(Spacer(1, 0.2*inch))
        
        # Legend
        elements.append(self.create_legend())
        
        # Build PDF
        doc.build(elements, onFirstPage=self.add_footer, onLaterPages=self.add_footer)
        
        print(f"PDF generated: {filename}")
        return filename
    
    def generate_all_pdfs(self, output_dir='timetables'):
        """Generate PDFs for all classes"""
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        generated_files = []
        for class_id in self.scheduler.classes.keys():
            filename = f"{output_dir}/timetable_{class_id}.pdf"
            self.generate_pdf(class_id, filename)
            generated_files.append(filename)
        
        print(f"\n{'='*60}")
        print(f"Generated {len(generated_files)} PDF timetables")
        print(f"{'='*60}")
        
        return generated_files


# Integration with GeneticTimetableScheduler
def add_pdf_generation_to_scheduler():
    """
    Add PDF generation method to GeneticTimetableScheduler class
    Usage: scheduler.generate_pdf_timetables(best_solution)
    """
    
    def generate_pdf_timetables(self, chromosome, output_dir='timetables'):
        """Generate PDF timetables for all classes"""
        pdf_gen = TimetablePDFGenerator(self, chromosome)
        return pdf_gen.generate_all_pdfs(output_dir)
    
    return generate_pdf_timetables


# Example usage
if __name__ == "__main__":
    print("Timetable PDF Generator - MIT SOC Style")
    print("="*60)
    print("\nThis module generates professional PDF timetables")
    print("similar to MIT School of Computing format.")
    print("\nUsage:")
    print("1. Run genetic algorithm to get best solution")
    print("2. Create PDF generator:")
    print("   pdf_gen = TimetablePDFGenerator(scheduler, best_solution)")
    print("   pdf_gen.generate_all_pdfs('output_folder')")
    print("\nOr use integrated method:")
    print("   scheduler.generate_pdf_timetables(best_solution)")
    print("="*60)