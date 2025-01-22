document.addEventListener('DOMContentLoaded', function() {
    // Format date function
    function formatDate(date) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    // Format time function
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    }

    // Set current date when page loads
    const currentDate = new Date();
    document.getElementById('date').value = formatDate(currentDate);

    // Set print layout for half-letter size crosswise
    function setPrintStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                @page {
                    size: 8.5in 5.5in landscape; /* Half of letter size in landscape */
                    margin: 0.5in;
                }
                body {
                    font-size: 12pt;
                    width: 100%;
                }
                .call-slip {
                    width: 100%;
                    page-break-after: always;
                }
            }
        `;
        document.head.appendChild(style);
    }
    setPrintStyle();

    // Fetch student data function
    async function fetchStudentData(userId) {
        try {
            const response = await fetch(`get_callslip.php?userId=${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            if (data.success) {
                // Fill the form with student data
                document.getElementById('studentName').value = data.data.studentName;
                document.getElementById('courseYear').value = `${data.data.course} - ${data.data.year}`;
                document.getElementById('unit').value = data.data.department;
                if (data.data.appointmentTime) {
                    document.getElementById('appointmentTime').value = formatTime(data.data.appointmentTime);
                }
            } else {
                alert('Student not found');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            alert('Error loading student information. Please try again.');
        }
    }

    // Save call slip function
    async function saveCallSlip(formData) {
        try {
            const response = await fetch('save_callslip.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            
            if (result.success) {
                alert('Call slip saved successfully');
                exportToPDF(); // Trigger PDF export after saving
            } else {
                alert(result.message || 'Error saving call slip');
            }
        } catch (error) {
            console.error('Error saving call slip:', error);
            alert('Error saving call slip. Please try again.');
        }
    }

    // Export call slip to PDF
    function exportToPDF() {
        window.print(); // Opens the print dialog for PDF export
    }

    // Handle reschedule checkbox
    const rescheduleCheckbox = document.getElementById('reschedule');
    const rescheduleReason = document.getElementById('rescheduleReason');
    
    rescheduleCheckbox.addEventListener('change', function() {
        rescheduleReason.disabled = !this.checked;
        if (!this.checked) {
            rescheduleReason.value = '';
        }
    });

    // Handle allow student checkbox
    const allowStudentCheckbox = document.getElementById('allowStudent');
    allowStudentCheckbox.addEventListener('change', function() {
        if (this.checked) {
            rescheduleCheckbox.checked = false;
            rescheduleReason.disabled = true;
            rescheduleReason.value = '';
        }
    });

    // Handle form submission
    document.getElementById('callSlipForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all selected reasons
        const selectedReasons = Array.from(document.querySelectorAll('input[name="reasons[]"]:checked'))
            .map(checkbox => {
                if (checkbox.value === 'Others') {
                    return `Others: ${document.getElementById('othersSpecify').value}`;
                }
                return checkbox.value;
            });

        if (selectedReasons.length === 0) {
            alert('Please select at least one reason for counseling.');
            return;
        }

        const formData = {
            userId: new URLSearchParams(window.location.search).get('userId'),
            date: document.getElementById('date').value,
            unit: document.getElementById('unit').value,
            studentName: document.getElementById('studentName').value,
            courseYear: document.getElementById('courseYear').value,
            appointmentTime: document.getElementById('appointmentTime').value,
            allowStudent: document.getElementById('allowStudent').checked,
            reschedule: document.getElementById('reschedule').checked,
            rescheduleReason: document.getElementById('rescheduleReason').value,
            reasons: selectedReasons,
            othersSpecify: document.getElementById('othersSpecify').value,
            createdAt: new Date().toISOString()
        };
        
        saveCallSlip(formData);
    });

    // Get user ID from URL and fetch student data
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    if (userId) {
        fetchStudentData(userId);
    } else {
        // alert('No user ID provided');
    }

    // Add print button event listener
    document.getElementById('printCallSlip').addEventListener('click', exportToPDF);
});
document.getElementById('others').addEventListener('change', function() {
    const othersInput = document.getElementById('othersSpecify');
    othersInput.disabled = !this.checked;
    if (this.checked) {
        othersInput.focus();
    }
});