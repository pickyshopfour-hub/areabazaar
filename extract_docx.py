import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def extract_text(docx_path):
    if not os.path.exists(docx_path):
        return f"Error: File not found {docx_path}"
    
    try:
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            # Word document text is usually in word/document.xml
            xml_content = zip_ref.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespaces for Word XML
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Extract all text elements
            texts = []
            for paragraph in tree.findall('.//w:p', ns):
                paragraph_text = ""
                for run in paragraph.findall('.//w:r', ns):
                    for t in run.findall('.//w:t', ns):
                        if t.text:
                            paragraph_text += t.text
                if paragraph_text:
                    texts.append(paragraph_text)
            
            return "\n".join(texts)
    except Exception as e:
        return f"Error extracting {docx_path}: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <path_to_docx>")
    else:
        print(extract_text(sys.argv[1]))
