import app = require("teem");

class AvatarRoute{
    public async cursos(req: app.Request, res: app.Response) {
		res.render("index/cursos");
	};

	public async qualiSI(req: app.Request, res: app.Response) {
		res.render("index/qualiSI");
	};

	public async qualiSI2(req: app.Request, res: app.Response) {
		res.render("index/qualiSI2");
	};

	public async qualiSI3(req: app.Request, res: app.Response) {
		res.render("index/qualiSI3");
	};

	public async qualiSI4(req: app.Request, res: app.Response) {
		res.render("index/qualiSI4");
	};

	public async qualiSI5(req: app.Request, res: app.Response) {
		res.render("index/qualiSI5");
	};

	public async erro(req: app.Request, res: app.Response) {
		res.render("index/erro");
	};

	public async resultado(req: app.Request, res: app.Response) {
		res.render("index/resultado");
	};
}

export = AvatarRoute;