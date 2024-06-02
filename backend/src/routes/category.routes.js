import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getCategories);
router.route("/createCategory").post(createCategory);
router.route("/:categoryId").patch(updateCategory).delete(deleteCategory);

export default router;
