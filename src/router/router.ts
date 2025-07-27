import { Router } from "express";
import { authController } from "../controller/userController";
import { userJwtAuthenticator } from "../middlewares/userAuthMiddlware";
import { checkDailyLimit } from "../middlewares/dialyLimit";
import { urlContrller } from "../controller/urlController";

export const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/generate-newtoken", authController.genereteAccess);

router.post(
  "/generate-url",
  userJwtAuthenticator,
  checkDailyLimit,
  urlContrller.createUrl
);
router.get(
  "/fetch-urls",
  userJwtAuthenticator,
  userJwtAuthenticator,
  urlContrller.fetchUrls
);
/////////////handling redirecting for short link
router.get("/url/:shortUrl", urlContrller.urlRedirecting);
