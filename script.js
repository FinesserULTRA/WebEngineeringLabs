// Calendar functionality
class Calendar {
    constructor() {
        // Initialize state
        this.currentDate = new Date();
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        this.currentView = 'month';
        this.pakistanHolidays = [];
        this.showHolidays = true;

        // DOM elements
        this.monthDisplay = document.getElementById('month-display');
        this.monthGrid = document.getElementById('month-grid');
        this.weekGrid = document.getElementById('week-view');

        // Modal elements
        this.modal = document.getElementById('event-modal');
        this.closeBtn = document.querySelector('.close-btn');
        this.eventForm = document.getElementById('event-form');
        this.eventDateInput = document.getElementById('event-date');
        this.eventNameInput = document.getElementById('event-name');
        this.eventLocationInput = document.getElementById('event-location');
        this.eventPriorityInput = document.getElementById('event-priority');
        this.eventTypeInputs = document.querySelectorAll('input[name="event-type"]');
        this.eventColorInputs = document.querySelectorAll('input[name="event-color"]');
        this.timeInputsContainer = document.getElementById('time-inputs');
        this.eventStartTimeInput = document.getElementById('event-start-time');
        this.eventEndTimeInput = document.getElementById('event-end-time');
        this.eventCategoryInput = document.getElementById('event-category');
        this.eventDescInput = document.getElementById('event-desc');
        this.cancelBtn = document.getElementById('cancel-event');

        // Day events modal elements
        this.dayEventsModal = document.getElementById('day-events-modal');
        this.closeDayEventsBtn = document.getElementById('close-day-events');
        this.dayEventsList = document.getElementById('day-events-list');
        this.addEventFromDayBtn = document.getElementById('add-event-from-day');

        // Initialize calendar
        this.initCalendar();

        // Fetch Pakistan holidays
        this.fetchPakistanHolidays();
    }

    initCalendar() {
        // Set up event listeners
        this.setupEventListeners();

        // Initialize the calendar view
        this.updateCalendarView();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => this.navigate(-1));
        document.getElementById('next-btn').addEventListener('click', () => this.navigate(1));
        document.getElementById('today-btn').addEventListener('click', () => this.goToToday());

        // View toggle buttons
        document.getElementById('month-view-btn').addEventListener('click', () => this.switchView('month'));
        document.getElementById('week-view-btn').addEventListener('click', () => this.switchView('week'));

        // Holiday toggle
        document.getElementById('show-holidays').addEventListener('change', (e) => {
            this.showHolidays = e.target.checked;
            this.updateCalendarView();
        });

        // Modal functionality
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
            if (e.target === this.dayEventsModal) {
                this.closeDayEventsModal();
            }
        });

        // Day events modal
        this.closeDayEventsBtn.addEventListener('click', () => this.closeDayEventsModal());
        this.addEventFromDayBtn.addEventListener('click', () => {
            this.closeDayEventsModal();
            this.openModal(this.selectedDateStr);
        });

        // Event type radio buttons
        this.eventTypeInputs.forEach(input => {
            input.addEventListener('change', () => this.toggleTimeInputs());
        });

        // Event form submission
        this.eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
    }

    goToToday() {
        this.currentDate = new Date();
        this.updateCalendarView();
    }

    toggleTimeInputs() {
        const isTimedEvent = document.getElementById('timed').checked;
        this.timeInputsContainer.style.display = isTimedEvent ? 'block' : 'none';
    }

    fetchPakistanHolidays() {
        const currentYear = new Date().getFullYear();

        // Comprehensive list of Pakistani national and Islamic holidays
        // Note: Islamic holidays are approximate as they depend on moon sighting
        this.pakistanHolidays = [
            // National holidays
            { name: "Kashmir Day", date: `${currentYear}-02-05`, type: "national" },
            { name: "Pakistan Day", date: `${currentYear}-03-23`, type: "national" },
            { name: "Labor Day", date: `${currentYear}-05-01`, type: "national" },
            { name: "Independence Day", date: `${currentYear}-08-14`, type: "national" },
            { name: "Defence Day", date: `${currentYear}-09-06`, type: "national" },
            { name: "Quaid-e-Azam Day", date: `${currentYear}-12-25`, type: "national" },
            { name: "Birth of Quaid-e-Azam", date: `${currentYear}-12-25`, type: "national" },

            // Islamic holidays for 2025 (approximate dates)
            { name: "1st Ramadan", date: `${currentYear}-02-28`, type: "islamic" },
            { name: "Laylat al-Qadr", date: `${currentYear}-03-24`, type: "islamic" },
            { name: "Eid al-Fitr", date: `${currentYear}-03-29`, type: "islamic" },
            { name: "Eid al-Fitr (Day 2)", date: `${currentYear}-03-30`, type: "islamic" },
            { name: "Eid al-Fitr (Day 3)", date: `${currentYear}-03-31`, type: "islamic" },
            { name: "Hajj", date: `${currentYear}-06-05`, type: "islamic" },
            { name: "Arafat Day", date: `${currentYear}-06-06`, type: "islamic" },
            { name: "Eid al-Adha", date: `${currentYear}-06-07`, type: "islamic" },
            { name: "Eid al-Adha (Day 2)", date: `${currentYear}-06-08`, type: "islamic" },
            { name: "Eid al-Adha (Day 3)", date: `${currentYear}-06-09`, type: "islamic" },
            { name: "Islamic New Year", date: `${currentYear}-07-07`, type: "islamic" },
            { name: "Ashura", date: `${currentYear}-07-16`, type: "islamic" },
            { name: "Ashura (Day 2)", date: `${currentYear}-07-17`, type: "islamic" },
            { name: "Mawlid al-Nabi", date: `${currentYear}-09-15`, type: "islamic" },

            // Add holidays for next year (for December view)
            { name: "Kashmir Day", date: `${currentYear + 1}-02-05`, type: "national" },
            { name: "Eid al-Fitr", date: `${currentYear + 1}-03-18`, type: "islamic" },

            // Add holidays from previous year (for January view)
            { name: "Quaid-e-Azam Day", date: `${currentYear - 1}-12-25`, type: "national" }
        ];


        // Update calendar after setting up sample holidays
        this.updateCalendarView();
    }

    updateCalendarView() {
        if (this.currentView === 'month') {
            this.renderMonthView();
        } else {
            this.renderWeekView();
        }
    }

    renderMonthView() {
        // Update header display
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        this.monthDisplay.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        // Clear the grid
        this.monthGrid.innerHTML = '';

        // Get first day of month and last day of month
        const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        // Get the day of the week of the first day (0-6, 0 being Sunday)
        const firstDayWeekday = firstDayOfMonth.getDay();

        // Calculate days from previous month to display
        const daysFromPrevMonth = firstDayWeekday;
        const prevMonthLastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();

        // Calculate total cells needed (previous month days + current month days + next month days to fill grid)
        const totalDays = 42; // 6 rows of 7 days

        // Create day cells and add to grid
        for (let i = 0; i < totalDays; i++) {
            let day = document.createElement('div');
            day.className = 'calendar-day';

            // Calculate date for this cell
            let date;
            let dateNum;
            let isOtherMonth = false;

            if (i < daysFromPrevMonth) {
                // Previous month dates
                dateNum = prevMonthLastDay - (daysFromPrevMonth - i - 1);
                date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, dateNum);
                isOtherMonth = true;
            } else if (i >= daysFromPrevMonth && i < daysFromPrevMonth + lastDayOfMonth.getDate()) {
                // Current month dates
                dateNum = i - daysFromPrevMonth + 1;
                date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), dateNum);
            } else {
                // Next month dates
                dateNum = i - (daysFromPrevMonth + lastDayOfMonth.getDate()) + 1;
                date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, dateNum);
                isOtherMonth = true;
            }

            // Format the date for storing events
            const dateStr = this.formatDateString(date);

            // Set data attribute for date
            day.dataset.date = dateStr;

            // Create date number element
            let dateElement = document.createElement('div');
            dateElement.className = 'date-number';
            dateElement.textContent = dateNum;

            // Apply classes for styling
            if (isOtherMonth) {
                day.classList.add('other-month');
            }

            // Check if this is today
            const today = new Date();
            if (date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()) {
                day.classList.add('current-day');
            }

            // Add click event to show day events or add event modal
            day.addEventListener('click', (e) => {
                // Only handle clicks on the cell itself, not on event buttons
                if (e.target === day || e.target === dateElement) {
                    const dayEvents = this.events[dateStr] || [];
                    if (dayEvents.length > 0) {
                        this.openDayEventsModal(dateStr);
                    } else {
                        this.openModal(dateStr);
                    }
                }
            });

            // Add date element to day cell
            day.appendChild(dateElement);

            // Add events for this day
            if (this.events[dateStr]) {
                this.events[dateStr].forEach((event, index) => {
                    this.addEventToCell(day, event, dateStr, index);
                });
            }

            // Add holidays for this day if enabled
            if (this.showHolidays) {
                const holidays = this.pakistanHolidays.filter(h => h.date === dateStr);
                if (holidays && holidays.length > 0) {
                    holidays.forEach(holiday => {
                        const holidayEvent = {
                            name: holiday.name,
                            isHoliday: true,
                            holidayType: holiday.type,
                            type: 'all-day'
                        };
                        this.addEventToCell(day, holidayEvent, dateStr, null);
                    });
                }
            }

            // Add day cell to grid
            this.monthGrid.appendChild(day);
        }
    }

    renderWeekView() {
        // Update header display
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Get first day of the week (Sunday) for the current date
        const firstDayOfWeek = new Date(this.currentDate);
        const dayOfWeek = this.currentDate.getDay();
        firstDayOfWeek.setDate(this.currentDate.getDate() - dayOfWeek);

        // Get last day of the week (Saturday)
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        // If the week spans two months or years
        if (firstDayOfWeek.getFullYear() !== lastDayOfWeek.getFullYear()) {
            this.monthDisplay.textContent = `${monthNames[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()} - ${monthNames[lastDayOfWeek.getMonth()]} ${lastDayOfWeek.getFullYear()}`;
        } else if (firstDayOfWeek.getMonth() !== lastDayOfWeek.getMonth()) {
            this.monthDisplay.textContent = `${monthNames[firstDayOfWeek.getMonth()]} - ${monthNames[lastDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;
        } else {
            this.monthDisplay.textContent = `${monthNames[firstDayOfWeek.getMonth()]} ${firstDayOfWeek.getFullYear()}`;
        }

        // Clear the grid
        document.getElementById('week-grid').innerHTML = '';

        // Create day cells for the week
        for (let i = 0; i < 7; i++) {
            let day = document.createElement('div');
            day.className = 'calendar-day';

            // Calculate date for this cell
            const date = new Date(firstDayOfWeek);
            date.setDate(firstDayOfWeek.getDate() + i);

            // Format the date for storing events
            const dateStr = this.formatDateString(date);

            // Set data attribute for date
            day.dataset.date = dateStr;

            // Check if this date is from a different month than the current viewed month
            if (date.getMonth() !== this.currentDate.getMonth()) {
                day.classList.add('other-month');
            }

            // Check if this is today
            const today = new Date();
            if (date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()) {
                day.classList.add('current-day');
            }

            // Create weekday name element
            let weekdayElement = document.createElement('div');
            weekdayElement.className = 'weekday-name';
            weekdayElement.textContent = dayNames[i];

            // Create date number element
            let dateElement = document.createElement('div');
            dateElement.className = 'date-number';
            dateElement.textContent = date.getDate();

            // Add click event to show day events or add event modal
            day.addEventListener('click', (e) => {
                // Only handle clicks on the cell itself, not on event buttons
                if (e.target === day || e.target === weekdayElement || e.target === dateElement) {
                    const dayEvents = this.events[dateStr] || [];
                    if (dayEvents.length > 0) {
                        this.openDayEventsModal(dateStr);
                    } else {
                        this.openModal(dateStr);
                    }
                }
            });

            // Add elements to day cell
            day.appendChild(weekdayElement);
            day.appendChild(dateElement);

            // Add events for this day
            if (this.events[dateStr]) {
                // Sort events - all-day events first, then by start time
                const sortedEvents = [...this.events[dateStr]].sort((a, b) => {
                    if (a.type === 'all-day' && b.type !== 'all-day') return -1;
                    if (a.type !== 'all-day' && b.type === 'all-day') return 1;
                    if (a.type === 'timed' && b.type === 'timed') {
                        return a.startTime < b.startTime ? -1 : 1;
                    }
                    return 0;
                });

                sortedEvents.forEach((event, index) => {
                    this.addEventToCell(day, event, dateStr, index);
                });
            }

            // Add holidays for this day if enabled
            if (this.showHolidays) {
                const holidays = this.pakistanHolidays.filter(h => h.date === dateStr);
                if (holidays && holidays.length > 0) {
                    holidays.forEach(holiday => {
                        const holidayEvent = {
                            name: holiday.name,
                            isHoliday: true,
                            holidayType: holiday.type,
                            type: 'all-day'
                        };
                        this.addEventToCell(day, holidayEvent, dateStr, null);
                    });
                }
            }

            // Add day cell to grid
            document.getElementById('week-grid').appendChild(day);
        }
    }

    addEventToCell(cell, event, dateStr, eventIndex) {
        const eventElement = document.createElement('div');

        // Set base class and add category class
        eventElement.className = `event ${event.category || 'default'}`;

        // Add event type class (all-day or timed)
        if (event.type === 'timed') {
            eventElement.classList.add('timed');
        } else {
            eventElement.classList.add('all-day');
        }

        // Add holiday class if it's a holiday
        if (event.isHoliday) {
            eventElement.classList.add('holiday');
            // Set holiday type as attribute for styling
            eventElement.setAttribute('holiday-type', event.holidayType);
        }

        // Apply custom color if set
        if (event.color && !event.isHoliday) {
            eventElement.style.borderLeftColor = event.color;
        }

        // Add priority class
        if (event.priority) {
            eventElement.classList.add(`priority-${event.priority}`);
        }

        let eventText = '';

        // Add appropriate icon based on event type
        if (event.isHoliday) {
            if (event.holidayType === 'islamic') {
                eventText += '<i class="fas fa-moon"></i>';
            } else {
                eventText += '<i class="fas fa-flag"></i>';
            }
        } else if (event.type === 'timed') {
            eventText += '<i class="fas fa-clock"></i>';
        } else {
            eventText += '<i class="fas fa-calendar-day"></i>';
        }

        // Display event content based on type
        if (event.type === 'timed' && event.startTime) {
            let timeStr = event.startTime;
            if (event.endTime) {
                timeStr += ` - ${event.endTime}`;
            }
            eventElement.innerHTML = `
                <div class="event-content">${eventText} ${timeStr}: ${event.name}</div>
                <div class="event-actions">
                    <button class="event-action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="event-action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
        } else {
            eventElement.innerHTML = `
                <div class="event-content">${eventText} ${event.name}</div>
                <div class="event-actions">
                    <button class="event-action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="event-action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }

        // Don't add edit/delete buttons for holidays
        if (event.isHoliday) {
            eventElement.innerHTML = `<div class="event-content">${eventText} ${event.name}</div>`;
        }

        // Add event listeners for edit and delete
        if (!event.isHoliday) {
            const editBtn = eventElement.querySelector('.edit');
            const deleteBtn = eventElement.querySelector('.delete');

            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editEvent(dateStr, eventIndex);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteEvent(dateStr, eventIndex);
                });
            }
        }

        // Construct detailed tooltip
        let tooltipContent = `${event.name}`;

        if (event.type === 'timed' && event.startTime) {
            tooltipContent += `\nTime: ${event.startTime}`;
            if (event.endTime) {
                tooltipContent += ` - ${event.endTime}`;
            }
        }

        if (event.category && event.category !== 'default') {
            tooltipContent += `\nCategory: ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}`;
        }

        if (event.description) {
            tooltipContent += `\n\n${event.description}`;
        }

        eventElement.title = tooltipContent;

        cell.appendChild(eventElement);
    }

    navigate(direction) {
        if (this.currentView === 'month') {
            // Navigate by month
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        } else {
            // Navigate by week
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        }
        this.updateCalendarView();
    }

    switchView(view) {
        this.currentView = view;

        // Update active button styling
        document.getElementById('month-view-btn').classList.toggle('active', view === 'month');
        document.getElementById('week-view-btn').classList.toggle('active', view === 'week');

        // Show appropriate view
        document.getElementById('month-view').classList.toggle('active', view === 'month');
        document.getElementById('week-view').classList.toggle('active', view === 'week');

        this.updateCalendarView();
    }

    openModal(dateStr) {
        // Set the date in the form
        this.eventDateInput.value = dateStr;

        // Reset form fields
        this.eventNameInput.value = '';
        this.eventTimeInput.value = '';
        this.eventDescInput.value = '';

        // Show the modal
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.editingEventIndex = undefined;
        this.editingEventDate = undefined;
        // Reset modal title
        document.querySelector('#event-modal h3').innerHTML = `<i class="fas fa-plus-circle"></i> Add Event`;
    }

    saveEvent() {
        const dateStr = this.eventDateInput.value;
        const name = this.eventNameInput.value.trim();
        const location = this.eventLocationInput.value.trim();
        const priority = this.eventPriorityInput.value;
        const eventType = document.querySelector('input[name="event-type"]:checked').value;
        const eventColor = document.querySelector('input[name="event-color"]:checked').value;
        const startTime = this.eventStartTimeInput.value;
        const endTime = this.eventEndTimeInput.value;
        const category = this.eventCategoryInput.value;
        const description = this.eventDescInput.value.trim();

        if (!name) {
            alert('Event name is required!');
            return;
        }

        // Validate time inputs for timed events
        if (eventType === 'timed' && !startTime) {
            alert('Start time is required for timed events!');
            return;
        }

        if (eventType === 'timed' && endTime && startTime > endTime) {
            alert('End time must be after start time!');
            return;
        }

        // Create event object
        const event = {
            name: name,
            location: location,
            priority: priority,
            type: eventType,
            category: category,
            description: description,
            color: eventColor
        };

        // Add time information if it's a timed event
        if (eventType === 'timed') {
            event.startTime = startTime;
            if (endTime) {
                event.endTime = endTime;
            }
        }

        // Check if we're editing an existing event
        if (this.editingEventIndex !== undefined && this.editingEventDate) {
            // Update existing event
            this.events[this.editingEventDate][this.editingEventIndex] = event;
            this.editingEventIndex = undefined;
            this.editingEventDate = undefined;
        } else {
            // Add new event
            if (!this.events[dateStr]) {
                this.events[dateStr] = [];
            }
            this.events[dateStr].push(event);
        }

        // Save to localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));

        // Close modal
        this.closeModal();

        // Update calendar view
        this.updateCalendarView();
    }

    openModal(dateStr) {
        // Set the date in the form
        this.eventDateInput.value = dateStr;

        // Reset form fields
        this.eventNameInput.value = '';
        document.getElementById('all-day').checked = true;
        this.timeInputsContainer.style.display = 'none';
        this.eventStartTimeInput.value = '';
        this.eventEndTimeInput.value = '';
        this.eventCategoryInput.value = 'default';
        this.eventDescInput.value = '';

        // Format the date for display
        const selectedDate = new Date(dateStr);
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update modal title to show selected date
        document.querySelector('#event-modal h3').innerHTML = `<i class="fas fa-plus-circle"></i> Add Event on ${formattedDate}`;

        // Show the modal
        this.modal.style.display = 'flex';
    }

    editEvent(dateStr, eventIndex) {
        const event = this.events[dateStr][eventIndex];

        // Populate form with event data
        this.eventDateInput.value = dateStr;
        this.eventNameInput.value = event.name;
        this.eventLocationInput.value = event.location || '';
        this.eventPriorityInput.value = event.priority || 'medium';
        this.eventCategoryInput.value = event.category || 'default';
        this.eventDescInput.value = event.description || '';

        // Set event type
        const typeInput = document.querySelector(`input[name="event-type"][value="${event.type}"]`);
        if (typeInput) typeInput.checked = true;

        // Set color
        if (event.color) {
            const colorInput = document.querySelector(`input[name="event-color"][value="${event.color}"]`);
            if (colorInput) colorInput.checked = true;
        }

        // Show/hide time inputs
        if (event.type === 'timed') {
            this.timeInputsContainer.style.display = 'block';
            this.eventStartTimeInput.value = event.startTime || '';
            this.eventEndTimeInput.value = event.endTime || '';
        } else {
            this.timeInputsContainer.style.display = 'none';
        }

        // Change modal title
        document.querySelector('#event-modal h3').innerHTML = `<i class="fas fa-edit"></i> Edit Event`;

        // Store the event index for updating
        this.editingEventIndex = eventIndex;
        this.editingEventDate = dateStr;

        // Show modal
        this.modal.style.display = 'flex';
    }

    deleteEvent(dateStr, eventIndex) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events[dateStr].splice(eventIndex, 1);

            // Remove the date key if no events left
            if (this.events[dateStr].length === 0) {
                delete this.events[dateStr];
            }

            // Save to localStorage
            localStorage.setItem('calendarEvents', JSON.stringify(this.events));

            // Update calendar view
            this.updateCalendarView();
        }
    }

    openDayEventsModal(dateStr) {
        this.selectedDateStr = dateStr;
        const events = this.events[dateStr] || [];
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update modal title
        document.getElementById('day-events-title').innerHTML = `<i class="fas fa-calendar-day"></i> Events on ${formattedDate}`;

        // Clear previous events
        this.dayEventsList.innerHTML = '';

        if (events.length === 0) {
            this.dayEventsList.innerHTML = `
                <div class="empty-day-message">
                    <i class="fas fa-calendar-plus"></i>
                    <p>No events scheduled for this day</p>
                    <small>Click "Add New Event" to create one</small>
                </div>
            `;
        } else {
            events.forEach((event, index) => {
                const eventItem = document.createElement('div');
                eventItem.className = `day-event-item ${event.priority ? 'priority-' + event.priority : ''}`;

                // Apply custom color
                if (event.color) {
                    eventItem.style.borderLeftColor = event.color;
                }

                // Build event details HTML
                let detailsHTML = '';

                if (event.type === 'timed' && event.startTime) {
                    let timeStr = event.startTime;
                    if (event.endTime) {
                        timeStr += ` - ${event.endTime}`;
                    }
                    detailsHTML += `
                        <div class="day-event-detail">
                            <i class="fas fa-clock"></i>
                            <span>${timeStr}</span>
                        </div>
                    `;
                } else {
                    detailsHTML += `
                        <div class="day-event-detail">
                            <i class="fas fa-calendar-day"></i>
                            <span>All Day</span>
                        </div>
                    `;
                }

                if (event.location) {
                    detailsHTML += `
                        <div class="day-event-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                    `;
                }

                if (event.description) {
                    detailsHTML += `
                        <div class="day-event-detail">
                            <i class="fas fa-align-left"></i>
                            <span>${event.description}</span>
                        </div>
                    `;
                }

                eventItem.innerHTML = `
                    <div class="day-event-header">
                        <div class="day-event-name ${event.priority === 'high' ? 'priority-high' : ''}">${event.name}</div>
                        <div class="day-event-actions">
                            <button class="day-event-btn edit" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="day-event-btn delete" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="day-event-details">
                        ${detailsHTML}
                    </div>
                    ${event.category && event.category !== 'default' ? `<span class="day-event-category ${event.category}">${event.category}</span>` : ''}
                `;

                // Add event listeners
                const editBtn = eventItem.querySelector('.edit');
                const deleteBtn = eventItem.querySelector('.delete');

                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeDayEventsModal();
                    this.editEvent(dateStr, index);
                });

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteEvent(dateStr, index);
                    // Refresh the modal
                    if (this.events[dateStr] && this.events[dateStr].length > 0) {
                        this.openDayEventsModal(dateStr);
                    } else {
                        this.closeDayEventsModal();
                    }
                });

                this.dayEventsList.appendChild(eventItem);
            });
        }

        // Show modal
        this.dayEventsModal.style.display = 'flex';
    }

    closeDayEventsModal() {
        this.dayEventsModal.style.display = 'none';
    }

    formatDateString(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
});