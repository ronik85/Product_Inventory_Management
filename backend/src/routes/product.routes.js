import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteProduct,
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  getProductsByCategory,
} from "../controllers/product.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getProducts);
router.route("/:categoryName").get(getProductsByCategory);
router.route("/createProduct").post(upload.single("image"), createProduct);
router.route("/id/:productId").get( getProductById);
router
  .route("/:productId")
  .get(getProductById)
  .patch(upload.single("image"), updateProduct)
  .delete(deleteProduct);
export default router;
