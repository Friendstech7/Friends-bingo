
/* script.js */
        document.addEventListener('DOMContentLoaded', function() {
            const numberButtons = document.querySelectorAll('.number-button');
            const betAmountInput = document.getElementById('bet_amount');
            const selectedNumbersInput = document.getElementById('selected_numbers');
            const numberOfSelectedNumbersInput = document.getElementById('number_of_selected_numbers');
            const winningPatternSelect = document.getElementById('winning_pattern');
            const totalAmountInput = document.getElementById('total_amount');
            const patternGrid = document.getElementById('pattern_grid');
            const resetButton = document.getElementById('reset-button');
            const announcementButton = document.getElementById('announcementButton');
            const announcementSound = new Audio('/audios/announcement.mp3');
            const createGameButton = document.getElementById('createGameButton'); // Now targeting by ID

            announcementButton.addEventListener('click', function() {
                announcementSound.play().catch(e => {
                    console.error("Error playing sound:", e);
                    alert('Error playing sound. Please check console for details.');
                });
            });

            let selectedNumbers = [];

            function updateTotalAmount() {
                const betAmount = parseFloat(betAmountInput.value) || 0;
                const numberOfSelected = selectedNumbers.length;
                const totalAmount = betAmount * numberOfSelected;
                totalAmountInput.value = totalAmount; // Update the hidden input
            }

            function updateButtonState() {
                createGameButton.disabled = selectedNumbers.length < 5;
            }
            numberButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const cardId = this.dataset.cardId;
                    if (selectedNumbers.includes(cardId)) {
                        selectedNumbers = selectedNumbers.filter(n => n !== cardId);
                        this.classList.remove('selected');
                    } else {
                        selectedNumbers.push(cardId);
                        this.classList.add('selected');
                    }
                    selectedNumbersInput.value = selectedNumbers.join(',');
                    numberOfSelectedNumbersInput.value = selectedNumbers.length;
                    updateTotalAmount(); // Update total amount whenever selection changes
                    updateButtonState(); // Update the state of the create game button
                });
            });

            betAmountInput.addEventListener('input', function() {
                updateTotalAmount(); // Update total amount on bet amount change
                updateButtonState(); // Also check button state on input change
            });
            winningPatternSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const patternData = JSON.parse(selectedOption.dataset.pattern);

                clearInterval(window.patternInterval);

                if (selectedOption.text === 'All Common Patterns') {
                    let patternIndex = 0;
                    displayPattern(patternData[patternIndex]);

                    window.patternInterval = setInterval(() => {
                        patternIndex = (patternIndex + 1) % patternData.length;
                        displayPattern(patternData[patternIndex]);
                    }, 3000);
                } else {
                    displayPattern(patternData);
                }
            });

            var toggleBtn = document.querySelector(
                '.dropdown-toggle');
            toggleBtn.addEventListener('click', toggleDropdown);

            function toggleDropdown() {
                var dropdownMenu = document.getElementById('dropdownMenu');
                if (dropdownMenu.classList.contains('hidden')) {
                    dropdownMenu.classList.remove('hidden');
                } else {
                    dropdownMenu.classList.add('hidden');
                }
            }

            // Close dropdown when clicking outside
            window.addEventListener('click', function(event) {
                if (!event.target.matches('.bg-gray-500') && !event.target.matches('.dropdown-toggle')) {
                    var dropdownMenu = document.getElementById('dropdownMenu');
                    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                        dropdownMenu.classList.add('hidden');
                    }
                }
            });

            function displayPattern(pattern) {
                patternGrid.innerHTML = '';
                const table = document.createElement('table');
                const headerRow = document.createElement('tr');
                const headers = ['B', 'I', 'N', 'G', 'O'];

                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);

                pattern.forEach((row, rowIndex) => {
                    const tr = document.createElement('tr');
                    row.forEach((cell, cellIndex) => {
                        const td = document.createElement('td');
                        const div = document.createElement('div');
                        if (cell || (rowIndex === 2 && cellIndex === 2)) {
                            div.className = (rowIndex === 2 && cellIndex === 2) ? 'free-spot' :
                                'circle';
                        }
                        td.appendChild(div);
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });

                patternGrid.appendChild(table);
            }

            resetButton.addEventListener('click', function() {
                selectedNumbers = [];
                numberButtons.forEach(button => {
                    button.classList.remove('selected');
                });
                selectedNumbersInput.value = '';
                numberOfSelectedNumbersInput.value = 0;
                updateTotalAmount(); // Reset total amount
                updateButtonState(); // Reset the state of the create game button
            });

            // Trigger change event to load the default pattern on page load
            winningPatternSelect.dispatchEvent(new Event('change'));
            updateTotalAmount(); // Update total amount on page load
            updateButtonState();

        });