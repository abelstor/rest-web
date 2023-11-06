import { Request, Response } from 'express';
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from '../../domain';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';

export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ ok: false, message: error.message });
            return;
        }
        res.status(500).json({ ok: false, message: 'Internal server error - check logs' });
    }

    public getTodos = (req: Request, res: Response) => {

        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json({ ok: true, todos }))
            .catch(error => this.handleError(res, error));
    }

    public getTodoById = (req: Request, res: Response) => {

        const id = +req.params.id;

        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json({ ok: true, todo }))
            .catch(error => this.handleError(res, error));
    }

    public createTodo = (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ ok: false, message: error });

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todo => res.json({ ok: true, todo }))
            .catch(error => this.handleError(res, error));
    }

    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ ok: false, message: error });

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo => res.json({ ok: true, todo }))
            .catch(error => this.handleError(res, error));
    }

    public deleteTodo = (req: Request, res: Response) => {

        const id = +req.params.id;

        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json({ ok: true, todo }))
            .catch(error => this.handleError(res, error));
    }

}