import PyPDF2

def extract_to_txt(pdf_path, txt_path, num_pages=20):
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            total = len(reader.pages)
            with open(txt_path, 'w', encoding='utf-8') as out:
                for i in range(min(num_pages, total)):
                    text = reader.pages[i].extract_text()
                    if text:
                        out.write(f"--- PAGE {i+1} ---\n")
                        out.write(text + "\n")
                        out.write("-" * 40 + "\n")
        print(f"Success! Data written to {txt_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_to_txt(r"c:\Users\Hoang Cuong\Desktop\khải\aptis\mock_tests\Aptis Practice Test.pdf", r"c:\Users\Hoang Cuong\Desktop\khải\aptis\mock_tests\extracted_practice.txt", 20)
