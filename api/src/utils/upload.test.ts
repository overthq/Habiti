import { describe, expect, test } from 'bun:test';

import { sniffImageMime } from './upload';

describe('sniffImageMime', () => {
	test('detects JPEG magic bytes', () => {
		const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
		expect(sniffImageMime(buf)).toBe('image/jpeg');
	});

	test('detects PNG magic bytes', () => {
		const buf = Buffer.from([
			0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00
		]);
		expect(sniffImageMime(buf)).toBe('image/png');
	});

	test('detects GIF87a magic bytes', () => {
		const buf = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x37, 0x61, 0x00]);
		expect(sniffImageMime(buf)).toBe('image/gif');
	});

	test('detects GIF89a magic bytes', () => {
		const buf = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00]);
		expect(sniffImageMime(buf)).toBe('image/gif');
	});

	test('detects WebP magic bytes (RIFF…WEBP)', () => {
		const buf = Buffer.from([
			0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50
		]);
		expect(sniffImageMime(buf)).toBe('image/webp');
	});

	test('rejects a text file claiming to be an image', () => {
		// "Hello world!" — no image magic bytes.
		const buf = Buffer.from('Hello world!', 'utf8');
		expect(sniffImageMime(buf)).toBeNull();
	});

	test('rejects a PDF (which is %PDF…)', () => {
		const buf = Buffer.from('%PDF-1.7\n', 'utf8');
		expect(sniffImageMime(buf)).toBeNull();
	});

	test('rejects truncated buffers (does not throw)', () => {
		expect(sniffImageMime(Buffer.alloc(0))).toBeNull();
		expect(sniffImageMime(Buffer.from([0xff]))).toBeNull();
	});

	test('rejects RIFF without WEBP suffix (e.g. WAV)', () => {
		const buf = Buffer.from([
			0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45
		]);
		expect(sniffImageMime(buf)).toBeNull();
	});
});
