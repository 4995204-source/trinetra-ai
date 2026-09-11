import json
from datetime import datetime
import os

class ReportGenerator:
    def __init__(self):
        self.reports = []
        print("📄 Report Generator Ready")

    def generate_report(self, report_type, data, date_range=None):
        """Generate a report"""
        report = {
            "id": len(self.reports) + 1,
            "type": report_type,
            "generated_at": datetime.now().isoformat(),
            "data": data,
            "date_range": date_range or {"start": "2026-08-01", "end": "2026-08-31"},
            "status": "ready"
        }
        self.reports.append(report)
        return report

    def get_mock_reports(self):
        """Generate mock reports for demo"""
        mock_reports = [
            {
                "id": 1,
                "type": "Daily Traffic Report",
                "date": "2026-08-27",
                "size": "2.4 MB",
                "status": "ready",
                "generated_by": "Admin",
                "generated_at": "2026-08-27 18:30:00"
            },
            {
                "id": 2,
                "type": "Vehicle Search Report",
                "date": "2026-08-26",
                "size": "1.8 MB",
                "status": "ready",
                "generated_by": "Admin",
                "generated_at": "2026-08-26 15:20:00"
            },
            {
                "id": 3,
                "type": "Trajectory Report",
                "date": "2026-08-25",
                "size": "3.2 MB",
                "status": "ready",
                "generated_by": "Admin",
                "generated_at": "2026-08-25 12:00:00"
            },
            {
                "id": 4,
                "type": "Alert Report",
                "date": "2026-08-24",
                "size": "1.1 MB",
                "status": "processing",
                "generated_by": "Admin",
                "generated_at": "2026-08-24 09:15:00"
            }
        ]
        return mock_reports