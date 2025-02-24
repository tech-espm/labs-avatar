const amp = /\&/g, lt = /</g, gt = />/g, quot = /\"/g, apos = /\'/g, grave = /\`/g;

export = function encodeValue(x: string | null): string {
	return (x ? x.replace(amp, "&amp;").replace(lt, "&lt;").replace(gt, "&gt;").replace(quot, "&#34;").replace(apos, "&#39;").replace(grave, "&#96;") : "");
}
