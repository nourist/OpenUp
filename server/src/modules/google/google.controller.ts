import { Controller } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
	constructor(private readonly googleService: GoogleService) {}
}
