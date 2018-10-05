import * as SDK from "azure-devops-extension-sdk/SDK";
import { getClient } from "azure-devops-extension-api/extensions/Client";
import { CommonServiceIds, IGlobalMessagesService, IProjectPageService, MessageBannerLevel } from "azure-devops-extension-api/extensions/CommonServices";

import { BuildServiceIds, IBuildDefinitionPageDataService } from "azure-devops-extension-api/extensions/BuildServices";
import { BuildRestClient } from "azure-devops-extension-api/clients/Build";

SDK.register("DynamicBannerService", () => {
    return {
        showBanner: async () => {

            const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
            const project = await projectService.getProject();

            const pageSvc = await SDK.getService<IBuildDefinitionPageDataService>(BuildServiceIds.BuildDefinitionPageDataService);
            const definition = await pageSvc.getDefinition();

            if (definition) {
                const result = await getClient(BuildRestClient).getDefinition(definition.id, project.id);
                const messageService = await SDK.getService<IGlobalMessagesService>(CommonServiceIds.GlobalMessagesService);
                messageService.setGlobalMessageBanner({
                    level: MessageBannerLevel.info,
                    messageFormat: `Build ${result.name} authored by ${result.authoredBy.displayName}. {0} for more details.`,
                    messageLinks: [{
                        name: "Click here",
                        href: result.url
                    }]
                });
            }
        }
    }
});

SDK.init();