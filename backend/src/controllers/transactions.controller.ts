import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, SyncTransactionsDto } from '../dto/transaction.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req: any) {
    return this.transactionsService.create({
      ...createTransactionDto,
      userId: req.user.sub,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.transactionsService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.transactionsService.findOneByUser(id, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: any) {
    return this.transactionsService.updateByUser(id, updateTransactionDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.transactionsService.removeByUser(id, req.user.sub);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  sync(@Body() syncTransactionsDto: SyncTransactionsDto, @Req() req: any) {
    return this.transactionsService.sync(syncTransactionsDto.transactions, req.user.sub);
  }
}
