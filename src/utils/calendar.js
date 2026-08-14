export function getGoogleCalendarUrl(event) {
  const { title, details, location, startDate, endDate } = event;
  const sDate = startDate ? startDate.replace(/-/g, '') : '20260810';
  const eDate = endDate ? endDate.replace(/-/g, '') : '20260815';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Séjour SmartStay Premium',
    details: details || 'Réservation confirmée via SmartStay Premium.',
    location: location || '',
    dates: `${sDate}T090000Z/${eDate}T180000Z`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event) {
  const { title, details, location, startDate, endDate } = event;
  const sDate = startDate ? startDate.replace(/-/g, '') : '20260810';
  const eDate = endDate ? endDate.replace(/-/g, '') : '20260815';

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmartStay Premium//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title || 'Séjour SmartStay Premium'}`,
    `DESCRIPTION:${details || 'Réservation SmartStay Premium'}`,
    `LOCATION:${location || ''}`,
    `DTSTART:${sDate}T090000Z`,
    `DTEND:${eDate}T180000Z`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'sejour-smartstay.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
