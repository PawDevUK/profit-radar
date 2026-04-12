function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function hasClassInHtml(html: string, className: string): boolean {
	const escapedClassName = escapeRegex(className);
	const classRegex = new RegExp(`class\\s*=\\s*["'](?:[^"'\\s]+\\s+)*${escapedClassName}(?:\\s+[^"']+)*["']`, 'i');

	return classRegex.test(html);
}
