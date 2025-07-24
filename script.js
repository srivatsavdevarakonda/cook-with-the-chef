document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const wordInput = document.getElementById('word-input');
    const startDateInput = document.getElementById('start-date-input');
    const heatmapContainer = document.getElementById('heatmap-container');
    const heatmapWrapper = document.getElementById('heatmap-wrapper');
    const activeDatesList = document.getElementById('active-dates-list');
    const activeDatesHeading = document.getElementById('active-dates-heading');
    const tooltip = document.getElementById('tooltip'); // New tooltip element

    // FONT DATA
    const FONT_5x7 = {
        'A': [" ### ", "#   #", "#####", "#   #", "#   #", "#   #", "#   #"],
        'B': ["#### ", "#   #", "#### ", "#   #", "#   #", "#   #", "#### "],
        'C': [" ####", "#    ", "#    ", "#    ", "#    ", "#    ", " ####"],
        'D': ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
        'E': ["#####", "#    ", "#### ", "#    ", "#    ", "#    ", "#####"],
        'F': ["#####", "#    ", "#### ", "#    ", "#    ", "#    ", "#    "],
        'G': [" ####", "#    ", "# ###", "#   #", "#   #", "#   #", " ####"],
        'H': ["#   #", "#   #", "#####", "#   #", "#   #", "#   #", "#   #"],
        'I': [" ### ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", " ### "],
        'J': ["  ###", "   # ", "   # ", "   # ", "#  # ", "#  # ", " ##  "],
        'K': ["#  # ", "# #  ", "##   ", "# #  ", "#  # ", "#  # ", "#  # "],
        'L': ["#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"],
        'M': ["#   #", "## ##", "# # #", "#   #", "#   #", "#   #", "#   #"],
        'N': ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
        'O': [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
        'P': ["#### ", "#   #", "#### ", "#    ", "#    ", "#    ", "#    "],
        'Q': [" ### ", "#   #", "#   #", "# # #", "#  # ", " ## #", " ### "],
        'R': ["#### ", "#   #", "#### ", "# #  ", "#  # ", "#   #", "#   #"],
        'S': [" ####", "#    ", " ### ", "    #", "    #", "#   #", "#### "],
        'T': ["#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
        'U': ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
        'V': ["#   #", "#   #", "#   #", " # # ", " # # ", "  #  ", "  #  "],
        'W': ["#   #", "#   #", "# # #", "# # #", "## ##", "#   #", "#   #"],
        'X': ["#   #", " # # ", "  #  ", "  #  ", " # # ", "#   #", "#   #"],
        'Y': ["#   #", " # # ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "],
        'Z': ["#####", "   # ", "  #  ", " #   ", "#    ", "#    ", "#####"],
        ' ': ["     ", "     ", "     ", "     ", "     ", "     ", "     "],
    };

    // NEW: Function to move tooltip with cursor
    document.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY + 15) + 'px';
    });

    const generateArt = () => {
        const rawInput = wordInput.value;
        const startDateStr = startDateInput.value;
        const cleanedWord = rawInput.trim().split(/\s+/).join(' ');

        if (!cleanedWord || !startDateStr) {
            alert("Please enter a word and select a start date.");
            return;
        }

        const upperWord = cleanedWord.toUpperCase();
        const gridWidth = upperWord.length * 6;
        const gridHeight = 7;
        let grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(' '));

        for (let i = 0; i < upperWord.length; i++) {
            const char = upperWord[i];
            const pattern = FONT_5x7[char] || FONT_5x7[' '];
            const colOffset = i * 6;
            for (let r = 0; r < gridHeight; r++) {
                for (let c = 0; c < 5; c++) {
                    if (pattern[r][c] === '#') {
                        grid[r][colOffset + c] = '#';
                    }
                }
            }
        }

        heatmapContainer.innerHTML = '';
        activeDatesList.innerHTML = '';
        const activeDates = [];
        const startDate = new Date(startDateStr + 'T00:00:00');

        for (let col = 0; col < gridWidth; col++) {
            for (let row = 0; row < gridHeight; row++) {
                const block = document.createElement('div');
                block.classList.add('day-block');
                const dayOffset = (col * 7) + row;
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + dayOffset);
                const dateString = currentDate.toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });

                if (grid[row][col] === '#') {
                    block.classList.add('color-dark-green');
                    activeDates.push(dateString);
                } else {
                    block.classList.add('color-gray');
                }
                heatmapContainer.appendChild(block);
                
                // NEW: Add event listeners for the custom tooltip
                block.addEventListener('mouseover', () => {
                    tooltip.textContent = dateString;
                    tooltip.style.display = 'block';
                });
                block.addEventListener('mouseout', () => {
                    tooltip.style.display = 'none';
                });
            }
        }
        
        activeDatesHeading.textContent = `Active Dates Required (${activeDates.length})`;

        if (activeDates.length > 0) {
            activeDates.forEach(date => {
                const li = document.createElement('li');
                li.textContent = `${date} → Make 40+ submissions`;
                activeDatesList.appendChild(li);
            });
        } else {
            activeDatesList.innerHTML = '<li>No active dates for this word.</li>';
        }
    };

    generateBtn.addEventListener('click', generateArt);

    downloadBtn.addEventListener('click', () => {
        if (heatmapContainer.children.length === 0 || heatmapContainer.querySelector('.placeholder-text')) {
            alert("Please generate an artwork first before downloading!");
            return;
        }
        
        html2canvas(heatmapWrapper, {
            backgroundColor: '#252525'
        }).then(canvas => {
            const link = document.createElement('a');
            const fileName = wordInput.value.trim().split(/\s+/).join('-') || 'art';
            link.download = `${fileName}-heatmap.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});