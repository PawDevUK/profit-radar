import { readFile, writeFile } from 'node:fs/promises';

const BLOCK_TAGS_TO_REMOVE = ['script', 'style', 'svg', 'noscript', 'template', 'iframe', 'canvas', 'object'];
const SELF_CLOSING_TAGS_TO_REMOVE = ['meta', 'link', 'base'];
const ALLOWED_ATTRIBUTE_PATTERN = /^(id|class|href|src|alt|title|role|type|name|value|aria-[\w-]+|data-[\w-]+)$/i;
const CLASS_BLOCKS_TO_REMOVE = ['fc-consent-root', 'fc-dialog-container', 'fc-help-dialog-container'];
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function extractBody(html: string): string {
	const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
	return bodyMatch ? bodyMatch[1] : html;
}

function removeTagBlocks(html: string, tagName: string): string {
	const blockPattern = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi');
	return html.replace(blockPattern, '');
}

function removeSelfClosingTags(html: string, tagName: string): string {
	const tagPattern = new RegExp(`<${tagName}\\b[^>]*\\/?>`, 'gi');
	return html.replace(tagPattern, '');
}

function getTagName(token: string): string | null {
	const match = token.match(/^<\/?\s*([a-z][\w:-]*)/i);
	return match ? match[1].toLowerCase() : null;
}

function isClosingTag(token: string): boolean {
	return /^<\//.test(token);
}

function isSelfClosingTag(token: string): boolean {
	const tagName = getTagName(token);
	return /\/\s*>$/.test(token) || (tagName !== null && VOID_TAGS.has(tagName));
}

function tokenHasClass(token: string, className: string): boolean {
	const classPattern = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const classAttributePattern = new RegExp(`\\bclass\\s*=\\s*("[^"]*\\b${classPattern}\\b[^"]*"|'[^']*\\b${classPattern}\\b[^']*')`, 'i');
	return classAttributePattern.test(token);
}

function removeElementsByClass(html: string, className: string): string {
	const tokens = html.match(/<[^>]+>|[^<]+/g) ?? [];
	const keptTokens: string[] = [];
	const skipStack: string[] = [];

	for (const token of tokens) {
		if (!token.startsWith('<')) {
			if (skipStack.length === 0) {
				keptTokens.push(token);
			}
			continue;
		}

		const tagName = getTagName(token);
		if (tagName === null) {
			if (skipStack.length === 0) {
				keptTokens.push(token);
			}
			continue;
		}

		if (skipStack.length > 0) {
			if (!isClosingTag(token) && !isSelfClosingTag(token)) {
				skipStack.push(tagName);
				continue;
			}

			if (isClosingTag(token)) {
				if (skipStack[skipStack.length - 1] === tagName) {
					skipStack.pop();
				} else {
					const matchingIndex = skipStack.lastIndexOf(tagName);
					if (matchingIndex !== -1) {
						skipStack.splice(matchingIndex, 1);
					}
				}
			}

			continue;
		}

		if (!isClosingTag(token) && tokenHasClass(token, className)) {
			if (!isSelfClosingTag(token)) {
				skipStack.push(tagName);
			}
			continue;
		}

		keptTokens.push(token);
	}

	return keptTokens.join('');
}

function stripNoisyAttributes(html: string): string {
	return html.replace(/<([a-z][\w:-]*)([^>]*)>/gi, (fullMatch, tagName: string, rawAttributes: string) => {
		if (fullMatch.startsWith('</')) {
			return fullMatch;
		}

		const isSelfClosing = /\/\s*>$/.test(fullMatch);
		const attributes = Array.from(rawAttributes.matchAll(/([:\w-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g));
		const keptAttributes: string[] = [];

		for (const [, name, value] of attributes) {
			if (!name || !ALLOWED_ATTRIBUTE_PATTERN.test(name)) {
				continue;
			}

			keptAttributes.push(value ? `${name}=${value}` : name);
		}

		const attributeSuffix = keptAttributes.length > 0 ? ` ${keptAttributes.join(' ')}` : '';
		return `<${tagName}${attributeSuffix}${isSelfClosing ? ' />' : '>'}`;
	});
}

export function stripHtml(rawHtml: string): string {
	let strippedHtml = extractBody(rawHtml).replace(/<!--[\s\S]*?-->/g, '');

	for (const tagName of BLOCK_TAGS_TO_REMOVE) {
		strippedHtml = removeTagBlocks(strippedHtml, tagName);
	}

	for (const tagName of SELF_CLOSING_TAGS_TO_REMOVE) {
		strippedHtml = removeSelfClosingTags(strippedHtml, tagName);
	}

	for (const className of CLASS_BLOCKS_TO_REMOVE) {
		strippedHtml = removeElementsByClass(strippedHtml, className);
	}

	strippedHtml = strippedHtml
		.replace(/<([a-z][\w:-]*)[^>]*\s(?:hidden|aria-hidden=("true"|'true'|true))[^>]*>[\s\S]*?<\/\1>/gi, '')
		.replace(/\s+/g, ' ')
		.replace(/>\s+</g, '><')
		.trim();

	return stripNoisyAttributes(strippedHtml);
}

export default async function stripHTML(): Promise<string> {
	const html = await readFile(new URL('./body-snapshot.html', import.meta.url), 'utf-8');
	return stripHtml(html);
}

const stripedHtml = await stripHTML();
// fs.writeFileSync('body-snapshot.html', stripedHtml, 'utf-8');
await writeFile('./striped.html', stripedHtml, 'utf-8');
