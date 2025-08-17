# Campuslektor
# Campuslektor

Campuslektor KI-Textanalyse-Report

A web-based report for analyzing AI-generated text content, built for Campuslektor in partnership with Detectora, a leading German provider of AI text detection. This project visualizes the proportion of a document likely authored by AI, based on Detectora's analysis, and provides detailed insights into text sections with high AI probability.
Live demo: https://zohurul01.github.io/Campuslektor/
Features

Donut Chart Visualization: Displays the percentage of the document identified as AI-generated (≥50% probability).
KPI Metrics: Shows the total number of text sections and those with high AI probability.
Detailed Table: Lists text sections with ≥50% AI probability, including rank, serial number, probability score, and content.
Responsive Design: Built with modern CSS and the Jost font for a clean, professional look.
Dynamic Data Loading: Fetches analysis data from a JSON file and populates the report dynamically.
Accessibility: Includes ARIA labels for screen reader support.

Project Structure
Campuslektor/
├── index.html        # Main HTML file for the report
├── styles.css        # CSS styles for layout and design
├── script.js         # JavaScript for dynamic data rendering
├── KW_Masterarbeit_Test.detectora.json  # Sample JSON data file
└── README.md         # Project documentation

Prerequisites

A modern web browser (e.g., Chrome, Firefox, Edge).
A web server to serve the JSON file (KW_Masterarbeit_Test.detectora.json) due to CORS restrictions in browsers when loading local files.
Internet access for loading the Jost font from Google Fonts.

Setup Instructions

Clone the Repository:
git clone https://github.com/zohurul01/Campuslektor.git
cd Campuslektor


Serve the Project:

Use a local web server to avoid CORS issues with JSON fetching. For example, with Python:python -m http.server 8000


Alternatively, use tools like live-server (Node.js) or any static file server.


Ensure JSON File Availability:

Place the KW_Masterarbeit_Test.detectora.json file in the project root.
Update the DATA_JSON_PATH constant in script.js if the JSON file name or location changes.


Access the Report:

Open http://localhost:8000 in your browser (adjust port as needed).
Or visit the live demo: https://zohurul01.github.io/Campuslektor/.



JSON Data Format
The script.js expects a JSON file (KW_Masterarbeit_Test.detectora.json) with the following structure:
{
  "report_id": "string",
  "document_id": "string",
  "meta": {
    "report_id": "string",
    "document_id": "string"
  },
  "section_results": [
    {
      "section": "string",
      "fake_probability": number,
      "all_tokens": number
    }
  ]
}


report_id or document_id: Unique identifier for the report.
section_results: Array of text sections with:
section: Text content of the section.
fake_probability: AI probability score (0–100 or 0–1).
all_tokens: Number of tokens in the section.



Usage

View the Report:

Open the project in a browser to see the report.
The donut chart displays the percentage of the document likely AI-generated.
The table lists sections with ≥50% AI probability, sorted by probability.


Update Data:

Replace KW_Masterarbeit_Test.detectora.json with your own JSON data.
Ensure the JSON matches the expected format (see above).


Customize:

Modify styles.css to adjust colors, fonts, or layout.
Update script.js for custom rendering logic or additional metrics.



Technologies Used

HTML5: Structure of the report.
CSS3: Styling with CSS variables and Jost font from Google Fonts.
JavaScript (ES6+): Dynamic rendering, JSON fetching, and DOM manipulation.
SVG: Donut chart visualization with smooth animations.
Bootstrap Icons: Social media and logo icons.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Please ensure code follows the project's style (2-space indentation, clear comments).
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, email: info@campuslektor.com.
Follow us on social media:

Instagram
TikTok
LinkedIn
YouTube


By: https://zohirs.com/

