import { verify } from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

export default authMiddleware;
