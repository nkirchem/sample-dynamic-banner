import * as SDK from "azure-devops-extension-sdk/SDK";
import { CommonServiceIds, IGlobalMessagesService, MessageBannerLevel } from "azure-devops-extension-api";

SDK.register("DynamicBannerService", () => {
    return {
        showBanner: async () => {
            const layoutService = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
            layoutService.setGlobalMessageBanner({
                level: MessageBannerLevel.info,
                messageFormat: `Custom banner message. {0} for more details.`,
                messageLinks: [{
                    name: "Click here",
                    href: "https://www.microsoft.com"
                }]
            });
        }
    }
});

SDK.init();