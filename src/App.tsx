/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { Select } from './types/Select';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

const USER_ID = 10364;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [select, setSelect] = useState(Select.All);
  const [errorMessage, setErrorMessage] = useState('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todoUrlEnd = '/todos?userId=10364';

  const createTodo = (data: Todo) => {
    client.post(todoUrlEnd, data);
  };

  const getTodo = async () => {
    const data: Todo[] = await client.get(todoUrlEnd);

    setTodos(data);
  };

  useEffect(() => {
    getTodo();
  }, [todos]);

  const handleSelectedTodos = useMemo(() => {
    let visibleTodos: Todo[] = [...todos];

    switch (select) {
      case Select.Active:
        visibleTodos = visibleTodos.filter(todo => todo.completed === false);
        break;

      case Select.Completed:
        visibleTodos = visibleTodos.filter(todo => todo.completed === true);
        break;

      case Select.All:
      default:
        break;
    }

    return visibleTodos;
  }, [todos, select]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header createTodo={createTodo} handleError={setErrorMessage} />
        <TodoList todos={handleSelectedTodos} />
        {/* Hide the footer if there are no todos */}
        <Footer
          onSelect={setSelect}
          todos={handleSelectedTodos}
          select={select}
        />
      </div>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorMessage && (
        <Notification
          message={errorMessage}
          handleError={setErrorMessage}
        />
      )}
    </div>
  );
};