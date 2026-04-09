import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeAdmin } from "../middleware/admin.middleware";
import { createProduct, deleteProduct, featuredProducts, getProduct, listProducts, updateProduct, uploadImages } from "../controllers/product.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/featured", featuredProducts);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);
router.post("/:id/images", authenticate, authorizeAdmin, upload.array("images", 10), uploadImages);

export default router;
