import { RestServer } from '@libs/boat';
import { AppModule } from './app';

RestServer.make(AppModule, { addValidationContainer: true, globalPrefix: "api/v1" });
