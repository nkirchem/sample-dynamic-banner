import "es6-promise/auto";
import * as DevOps from "azure-devops-extension-sdk";

import { getClient } from "azure-devops-extension-api/extension";
import { BuildRestClient } from "azure-devops-extension-api/clients/Build";
import { BuildDefinition } from "azure-devops-extension-api/types/Build";

DevOps.register("DynamicBannerService", () => {
    return {
        showBanner: async () => {

            DevOps.getService<DevOps.IProjectPageService>(DevOps.CommonServiceIds.ProjectPageService).then((projectService) => {
                projectService.getProject().then((project) => {

                    DevOps.getService<{ getDefinition: () => Promise<BuildDefinition | undefined> }>("ms.vss-build-web.definitions-page-data-service").then(pageSvc => {
                        pageSvc.getDefinition().then(def => {

                            if (def) {
                                getClient(BuildRestClient).getDefinition(def.id, project.id).then(result => {
                                    DevOps.getService<DevOps.IGlobalMessagesService>(DevOps.CommonServiceIds.GlobalMessagesService).then((messageService) => {
                                        messageService.setGlobalMessageBanner({
                                            level: DevOps.MessageBannerLevel.info,
                                            messageFormat: `Build ${def.name} authored by ${def.authoredBy.displayName}. {0} for more details.`,
                                            messageLinks: [{
                                                name: "Click here",
                                                href: def.url
                                            }]
                                        });
                                    });
                                });
                            }
                        });     
                    });
                });
            });
        }
    }
});

DevOps.init();