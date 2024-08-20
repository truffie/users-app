import { FC, useEffect, useState } from 'react';
import { Query, requestUsers, requestUsersWithError } from './api';
import { User } from './api';

export const Task: FC = () => {
  const [queryConfig, setQueryConfig] = useState<Query>({
    name: '',
    age: '',
    limit: 4,
    offset: 0,
  });

  const [userList, setUserList] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isFetched, setIsFetched] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const getUsers = async () => {
      setIsFetched(false);
      setIsError(false);

      try {
        // const data = await requestUsersWithError(queryConfig);
        const data = await requestUsers(queryConfig);
        setUserList(data);
        setIsFetched(true);
      } catch (error: any) {
        setIsError(true);
        setErrorMessage(error.message);
      }
    };

    getUsers();
  }, [queryConfig]);

  const updateQuery = (e: any) => {
    setQueryConfig(prev => ({
      ...prev,
      offset: 0,
      [e.target.name]: e.target.value,
    }));
    setCurrentPage(1);
  };

  const switchPage = (direction: 'prev' | 'next') => {
    //чтобы состояние зависило от общей переменной
    let newPage = currentPage;

    direction === 'prev'
      ? (newPage = currentPage - 1)
      : (newPage = currentPage + 1);

    setQueryConfig(prev => {
      return {
        ...prev,
        offset: (newPage - 1) * prev.limit,
      };
    });

    setCurrentPage(newPage);
  };

  const renderMessage = () => {
    return !isError ? <div>...Loading</div> : <div>{errorMessage}</div>;
  };

  const renderList = () => {
    return !userList.length ? (
      <div>Users not found</div>
    ) : (
      userList.map(user => <p key={user.id}>{`${user.name}, ${user.age}`}</p>)
    );
  };

  return (
    <div className="content">
      <div className="inpWrapper">
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={e => updateQuery(e)}
          value={queryConfig.name}
        />
        <input
          type="text"
          placeholder="Age"
          name="age"
          onChange={e => updateQuery(e)}
          value={queryConfig.age}
        />
      </div>

      <div className="listWrapper">
        {!isFetched ? renderMessage() : renderList()}
      </div>

      <div className="pagWrapper">
        <div>
          <label htmlFor="pageSize">By page:</label>
          <select
            id="pageSize"
            name="limit"
            onChange={e => updateQuery(e)}
            defaultValue={queryConfig.limit}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </div>

        <div>
          <button
            disabled={currentPage === 1 || !isFetched}
            onClick={() => switchPage('prev')}
          >
            prev
          </button>
          <p>{`page: ${currentPage}`}</p>
          <button
            disabled={queryConfig.limit > userList.length || !isFetched}
            onClick={() => switchPage('next')}
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
};
