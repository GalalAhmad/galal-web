export function parseClinicalDossier(rawNotes: string | null) {
  let notes = rawNotes || '';
  let homework: any[] = [];
  let courses: any[] = [];
  let readingPlan: any[] = [];

  if (rawNotes && typeof rawNotes === 'string' && rawNotes.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawNotes);
      notes = parsed.notes !== undefined ? parsed.notes : '';
      homework = Array.isArray(parsed.homework) ? parsed.homework : [];
      courses = Array.isArray(parsed.courses) ? parsed.courses : [];
      readingPlan = Array.isArray(parsed.readingPlan) ? parsed.readingPlan : [];
    } catch (e) {
      notes = rawNotes;
    }
  }
  return { notes, homework, courses, readingPlan };
}
