import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Home, Wallet, User } from "lucide-react";
import { TransferModal } from "../components/TransferModal";
import { useTranslation } from "../hooks/useTranslation";

export function SuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { userData, getFormReward, availableForms } = useApp();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const notificationShown = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (notificationShown.current) return;

    const registerServiceWorker = async () => {
      try {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Register service worker
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );

        // Show notification
        const formReward = getFormReward(id || "");
        const title = t("amountSuccessfullyRedeemed");
        const options = {
          body: `${t("youReceived")} ${t("currency")} ${formReward.toFixed(2)}`,
          icon: "icon-192.png",
          badge: "icon-192.png",
          vibrate: [200, 100, 200],
          tag: "form-reward",
          renotify: true,
          actions: [
            { action: "open", title: t("openApp") },
            { action: "close", title: t("close") },
          ],
        };

        await registration.showNotification(title, options);

        // Show in-app notification as well
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#424242]/60 text-white px-4 py-3 rounded-[20px] flex items-center gap-3 shadow-lg z-50 w-[90%] max-w-[360px]";
        notification.style.backdropFilter = "blur(0px)";
        notification.innerHTML = `
          <div class="flex items-center gap-3 w-full">
            <img src="https://i.ibb.co/bgqnF9Mv/icongoogle.png" alt="Google" class="w-7 h-7" />
            <div class="flex-1">
              <p class="font-medium text-[14px] leading-tight">${t(
                "amountSuccessfullyRedeemed"
              )}</p>
              <p class="text-[13px] text-white/90">${t("youReceived")} ${t(
          "currency"
        )} ${formReward.toFixed(2)}</p>
            </div>
            <span class="text-[13px] text-white/70 self-start">${t(
              "now"
            )}</span>
          </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 6000);
      } catch (error) {
        console.error("Ошибка при регистрации уведомлений:", error);
      }
    };

    registerServiceWorker();
    notificationShown.current = true;
  }, [id, getFormReward, t]);

  return (
    <div className="min-h-screen bg-[#F1F2FF] p-4">
      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <img
            src="https://itsmoney.com.br/_next/image?url=https%3A%2F%2Fitsmoney-admin.investimentosblue.com.br%2Fapp%2Fuploads%2F2023%2F11%2Fshutterstock_2277122315.webp&w=1920&q=75"
            alt={t("redemption")}
            className="w-full h-48 object-cover"
          />

          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">{t("redemption")}</h1>

            <p className="text-gray-700 mb-4">
              {t("thankYouMessage")}
              <br />
              {t("moneyAddedMessage")}
            </p>

            <div className="mb-6">
              <p className="flex items-center gap-2 mb-2">
                <span className="text-gray-700">{t("addedToAccount")}</span>
                <span className="text-[#00A650] font-medium">
                  + {t("currency")} {getFormReward(id || "").toFixed(2)}
                </span>
              </p>

              <div className="bg-[#F1F2FF] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#1A0FB0]" />
                  <span className="text-gray-700">{t("mySalary")}</span>
                </div>
                <p className="text-[#00A650] font-medium mt-1">
                  {t("currency")} {userData.salary.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="w-full bg-[#1A0FB0] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 mb-4"
            >
              <img
                src="https://i.ibb.co/ycd47ZT9/paypal-1.png"
                alt="PayPal"
                className="w-5 h-5"
              />
              {t("transferMoney")}
            </button>

            <Link
              to="/"
              className="block text-center text-[#1A0FB0] underline font-medium"
            >
              {t("backToHomePage")}
            </Link>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-[#1A0FB0] text-xl font-semibold mb-4">
            {t("availableForms")}
          </h2>

          {[1, 2, 3].map((index) => (
            <Link
              key={index}
              to={`/form/${index}`}
              className="block bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[#1A0FB0] font-medium">
                    {availableForms[index - 1].title}
                  </h3>
                  <p className="text-gray-500">
                    {availableForms[index - 1].type}
                  </p>
                </div>
                <span className="text-[#00A650] font-medium">
                  + {t("currency")} {getFormReward(index.toString()).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
          <p className="text-center text-[#1A0FB0] underline font-medium">
            {t("viewAllForms")}
          </p>
        </div>

        {/* Navigation menu */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
          <div className="container mx-auto px-8">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-[#1A0FB0]">
                <Home className="w-6 h-6" />
              </Link>
              <button className="text-[#1A0FB0]">
                <Wallet className="w-6 h-6" />
              </button>
              <button className="text-[#1A0FB0]">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
