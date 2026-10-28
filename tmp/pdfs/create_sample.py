from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

OUTPUT = 'output/pdf/medexplain-synthetic-sample-report.pdf'
NAVY = colors.HexColor('#17383A')
TEAL = colors.HexColor('#17836F')
MINT = colors.HexColor('#EAF5F0')
GRAY = colors.HexColor('#667875')

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Brand', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=TEAL, leading=13, spaceAfter=5))
styles.add(ParagraphStyle(name='ReportTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=23, leading=28, alignment=TA_LEFT, textColor=NAVY, spaceAfter=5))
styles.add(ParagraphStyle(name='Sub', parent=styles['Normal'], fontSize=10, leading=15, textColor=GRAY, spaceAfter=14))
styles.add(ParagraphStyle(name='Section', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=NAVY, spaceBefore=17, spaceAfter=8))
styles.add(ParagraphStyle(name='Body2', parent=styles['BodyText'], fontSize=9.5, leading=14, textColor=colors.HexColor('#354E4A'), spaceAfter=5))
styles.add(ParagraphStyle(name='Tiny', parent=styles['BodyText'], fontSize=8, leading=11, textColor=GRAY))
styles.add(ParagraphStyle(name='Badge', parent=styles['BodyText'], fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=TEAL, alignment=TA_CENTER))

def p(text, style='Body2'):
    return Paragraph(text, styles[style])

doc = SimpleDocTemplate(OUTPUT, pagesize=letter, rightMargin=0.72*inch, leftMargin=0.72*inch, topMargin=0.62*inch, bottomMargin=0.65*inch, title='Fictional Sample Medical Lab Report', author='MedExplain Synthetic Test Fixture')
story = []
story += [p('MEDEXPLAIN  /  SYNTHETIC TEST FIXTURE', 'Brand'), p('Sample Medical Lab Report', 'ReportTitle'), p('Fictional data for API and interface testing only', 'Sub'), HRFlowable(width='100%', thickness=1, color=colors.HexColor('#DCEBE5'), spaceAfter=13)]
meta = Table([[p('<b>Patient</b><br/>Sample Person'), p('<b>Report date</b><br/>January 15, 2026'), p('<b>Laboratory</b><br/>Example Lab')]], colWidths=[2.25*inch]*3)
meta.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),MINT),('BOX',(0,0),(-1,-1),0.5,colors.HexColor('#DCEBE5')),('INNERGRID',(0,0),(-1,-1),0.5,colors.white),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
story += [meta, p('Complete Blood Count', 'Section')]
rows = [['Test name','Observed value','Unit','Reference range'], ['Hemoglobin','13.2','g/dL','12.0 - 16.0 g/dL'], ['White blood cell count','7.1','x10^9/L','4.0 - 11.0 x10^9/L'], ['Platelets','250','x10^9/L','150 - 400 x10^9/L']]
story += [Table([[p(str(cell),'Tiny' if r else 'Badge') for cell in row] for r,row in enumerate(rows)], colWidths=[2.35*inch,1.3*inch,1.25*inch,2.0*inch], style=TableStyle([('BACKGROUND',(0,0),(-1,0),MINT),('BOX',(0,0),(-1,-1),0.5,colors.HexColor('#DFEAE5')),('INNERGRID',(0,0),(-1,-1),0.35,colors.HexColor('#E7EFEB')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]))]
story += [p('Metabolic Panel', 'Section')]
rows = [['Test name','Observed value','Unit','Reference range'], ['Glucose, fasting','108','mg/dL','70 - 99 mg/dL'], ['Creatinine','0.9','mg/dL','0.6 - 1.2 mg/dL']]
story += [Table([[p(str(cell),'Tiny' if r else 'Badge') for cell in row] for r,row in enumerate(rows)], colWidths=[2.35*inch,1.3*inch,1.25*inch,2.0*inch], style=TableStyle([('BACKGROUND',(0,0),(-1,0),MINT),('BOX',(0,0),(-1,-1),0.5,colors.HexColor('#DFEAE5')),('INNERGRID',(0,0),(-1,-1),0.35,colors.HexColor('#E7EFEB')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]))]
story += [Spacer(1,18), HRFlowable(width='100%', thickness=0.7, color=colors.HexColor('#DCEBE5'), spaceAfter=10), p('<b>End of report.</b> This synthetic sample contains fictional values and was created only to test software. It is not a real patient record and must not be used for medical decisions.', 'Body2'), Spacer(1,5), p('Testing note: One value is intentionally above its printed reference range. A report explainer should preserve the printed value and range and describe uncertainty without diagnosing.', 'Tiny')]

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#E5EEEA'))
    canvas.line(0.72*inch, 0.48*inch, letter[0]-0.72*inch, 0.48*inch)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(0.72*inch, 0.31*inch, 'FICTIONAL SAMPLE  |  NOT FOR CLINICAL USE')
    canvas.drawRightString(letter[0]-0.72*inch, 0.31*inch, f'Page {doc.page}')
    canvas.restoreState()

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
