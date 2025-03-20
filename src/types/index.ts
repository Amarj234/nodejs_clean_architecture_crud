import express from "express";
import { PopulateOptions } from "mongoose";
import { CreateLeadSourceService, DeleteLeadSourceService, GetAllLeadSourceService, UpdateLeadSourceService } from "../app/leadSource";
import { CreateUserSourceService, DeleteUserSourceService, GetAllUserSourceService, UpdateUserSourceService } from "../app/users";

import nconf from "../configs";
import { LeadSourceModel } from "../core/database/models/lead-source.model";
import { LeadSourceRepository } from "../core/repository/leadSource/lead-source.repository";
import { LeadSourceController } from "../interfaces/http/controllers/lead-source.controller";
 import { UserSourceController } from "../interfaces/http/userControllers/UserController";
import { errorHandler } from "../interfaces/http/middlewares/error.middleware";
import { UserSourceModel } from "../core/database/models/user-register";
import {LeadSourceUserRepository} from "../core/repository/users/UserRepository";
export interface ContainerDefinition {

    // Common
    app: express.Express;
    config: nconf.Provider;
    errorHandler: typeof errorHandler;

    // Models
    LeadSourceModel: LeadSourceModel;
    UserSourceModel: UserSourceModel;
    // Repositories
    leadSourceRepository: LeadSourceRepository;
    leadSourceUserRepository:  LeadSourceUserRepository;
    // Controllers
    leadSourceController: LeadSourceController;
    userSourceController: UserSourceController;
    // Lead Source Services
    createLeadSourceService: CreateLeadSourceService;
    getAllLeadSourceService: GetAllLeadSourceService;
    updateLeadSourceService: UpdateLeadSourceService;
    deleteLeadSourceService: DeleteLeadSourceService;


    createUserSourceService: CreateUserSourceService;
    getAllUserSourceService: GetAllUserSourceService;
    updateUserSourceService: UpdateUserSourceService;
    deleteUserSourceService: DeleteUserSourceService;
}

export type Populate = PopulateOptions | (PopulateOptions | string)[];
