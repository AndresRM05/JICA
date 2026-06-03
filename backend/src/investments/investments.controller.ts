// /backend/src/investments/investments.controller.ts
@Controller('investments')
@UseGuards(EntraIdGuard, RolesGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}
 
  @Get()
  @Roles('investor', 'admin')
  findAll(@Query() filters: GetInvestmentsQueryDto) {
    return this.investmentsService.findAll(filters);
  }
 
  @Get(':id')
  @Roles('investor', 'admin')
  findOne(@Param('id') id: string) {
    return this.investmentsService.findOne(id);
  }
 
  @Post(':id/interest')
  @Roles('investor')
  registerInterest(
    @Param('id') investmentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.investmentsService.registerInterest(investmentId, user.id);
  }
}