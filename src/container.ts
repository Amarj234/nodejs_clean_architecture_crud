import { asClass, asValue, createContainer, InjectionMode, Lifetime } from "awilix";
import { app } from "./app";
import nconf from "./configs";
import { ContainerDefinition } from "./types";

import { CreateUserSourceService, DeleteUserSourceService, GetAllUserSourceService, UpdateUserSourceService } from "./app/users";
import { CreateLeadSourceService, DeleteLeadSourceService, GetAllLeadSourceService, UpdateLeadSourceService } from "./app/leadSource";
import { LeadSource } from "./core/database/models/lead-source.model";
import { LeadSourceUser } from "./core/database/models/user-register";
import { LeadSourceRepository } from "./core/repository/leadSource/lead-source.repository";
import { LeadSourceUserRepository } from "./core/repository/users/UserRepository";
import { LeadSourceController } from "./interfaces/http/controllers/lead-source.controller";
import { UserSourceController } from "./interfaces/http/userControllers/UserController";
import { errorHandler } from "./interfaces/http/middlewares/error.middleware";

const container = createContainer<ContainerDefinition>();

container.register({

    // Common
    app: asValue(app),
    config: asValue(nconf),
    errorHandler: asValue(errorHandler),

    // Models
    LeadSourceModel: asValue(LeadSource),
    UserSourceModel: asValue(LeadSourceUser),

    // Repositories
    leadSourceRepository: asClass(LeadSourceRepository, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    leadSourceUserRepository: asClass(LeadSourceUserRepository, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),

    // Controllers
    leadSourceController: asClass(LeadSourceController, { lifetime: Lifetime.SINGLETON }),
    userSourceController: asClass(UserSourceController, { lifetime: Lifetime.SINGLETON }),

    // LeadSource Services
    createLeadSourceService: asClass(CreateLeadSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    getAllLeadSourceService: asClass(GetAllLeadSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    updateLeadSourceService: asClass(UpdateLeadSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    deleteLeadSourceService: asClass(DeleteLeadSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),


 // UserSource Services
    createUserSourceService: asClass(CreateUserSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    getAllUserSourceService: asClass(GetAllUserSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    updateUserSourceService: asClass(UpdateUserSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
    deleteUserSourceService: asClass(DeleteUserSourceService, { lifetime: Lifetime.SCOPED, injectionMode: InjectionMode.CLASSIC }),
});

export default container;
