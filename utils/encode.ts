const amp = /\&/g, lt = /</g, gt = />/g;

export = function encode(x: string | null): string {
	return (x ? x.replace(amp, "&amp;").replace(lt, "&lt;").replace(gt, "&gt;") : "");
}
