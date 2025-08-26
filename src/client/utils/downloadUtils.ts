import { DatabaseEntry } from '../types/database';

export function downloadAsCSV(data: DatabaseEntry[], filename: string = 'database_export') {
  const headers = [
    'ID',
    'Date/Time',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Company',
    'Industry',
    'Comment',
    'Reason'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(entry => [
      entry.id,
      entry.date_time ? `"${entry.date_time}"` : '',
      `"${entry.first_name}"`,
      `"${entry.last_name}"`,
      `"${entry.email}"`,
      entry.phone ? `"${entry.phone}"` : '',
      entry.company ? `"${entry.company}"` : '',
      entry.industry ? `"${entry.industry}"` : '',
      entry.comment ? `"${entry.comment.replace(/"/g, '""')}"` : '',
      entry.reason ? `"${entry.reason.replace(/"/g, '""')}"` : ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function downloadAsJSON(data: DatabaseEntry[], filename: string = 'database_export') {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function downloadAsXML(data: DatabaseEntry[], filename: string = 'database_export') {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<database_entries>
${data.map(entry => `  <entry>
    <id>${entry.id}</id>
    <date_time>${entry.date_time || ''}</date_time>
    <first_name><![CDATA[${entry.first_name}]]></first_name>
    <last_name><![CDATA[${entry.last_name}]]></last_name>
    <email><![CDATA[${entry.email}]]></email>
    <phone><![CDATA[${entry.phone || ''}]]></phone>
    <company><![CDATA[${entry.company || ''}]]></company>
    <industry><![CDATA[${entry.industry || ''}]]></industry>
    <comment><![CDATA[${entry.comment || ''}]]></comment>
    <reason><![CDATA[${entry.reason || ''}]]></reason>
  </entry>`).join('\n')}
</database_entries>`;

  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xml`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}