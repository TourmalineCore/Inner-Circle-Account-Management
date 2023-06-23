/* eslint-disable react/no-unstable-nested-components */
import {
  MouseEventHandler, useContext, useEffect, useState,
} from 'react';

import moment from 'moment';
import clsx from 'clsx';

import { Button } from '@tourmalinecore/react-tc-ui-kit';
import { ClientTable } from '@tourmalinecore/react-table-responsive';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api } from '../../common/api';
import { Table } from '../../types';
import { LINK_TO_ACCOUNT_SERVICE } from '../../common/config/config';

import FilterMenu from './components/FilterMenu/FilterMenu';
import AccountManagementStateContext from './context/AccountManagementStateContext';
import AccessBasedOnPemissionsStateContext from '../../routes/state/AccessBasedOnPemissionsStateContext';

export type Row<TypeProps> = {
  original: TypeProps;
  values: TypeProps;
};

function AccountsPageContent() {
  const accountManagementState = useContext(AccountManagementStateContext);
  const accessToChanges = useContext(AccessBasedOnPemissionsStateContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAccountsAsync();
  }, []);

  const columns = [
    {
      Header: 'Name',
      accessor: 'lastName',
      minWidth: 300,
      Cell: ({ row }: Table<Accounts>) => {
        const {
          firstName, lastName, middleName, isBlocked,
        } = row.original;
        return (
          <div className={clsx('account-management-page__account', {
            'account-management-page__account--isBlocked': isBlocked,
          })}
          >
            {lastName}
            {' '}
            {firstName}
            {' '}
            {middleName || ''}
          </div>
        );
      },
    },
    {
      Header: 'Roles',
      accessor: 'roles',
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ row }: Table<Accounts>) => {
        const { roles, isBlocked } = row.original;
        return (
          <span className={clsx('account-management-page__account', {
            'account-management-page__account--isBlocked': isBlocked,
          })}
          >
            {roles.map((role, index) => (
              <span key={role.id}>
                {index > 0 ? `, ${role.name}` : role.name}
              </span>
            ))}
          </span>
        );
      },
    },
    {
      Header: 'Corporate Email',
      accessor: 'corporateEmail',
      disableFilters: true,
      disableSortBy: true,
      minWidth: 300,
      Cell: ({ row }: Table<Accounts>) => {
        const { corporateEmail, isBlocked } = row.original;
        return (
          <span className={clsx('account-management-page__account', {
            'account-management-page__account--isBlocked': isBlocked,
          })}
          >
            {corporateEmail}
          </span>
        );
      },
    },
    {
      Header: 'Creation date (UTC)',
      accessor: 'creationDate',
      disableFilters: true,
      minWidth: 250,
      Cell: ({ row }: Table<Accounts>) => {
        const { creationDate, isBlocked } = row.original;
        const formattedDate = moment(creationDate).format('DD.MM.YYYY HH:mm');

        return (
          <span className={clsx('account-management-page__account', {
            'account-management-page__account--isBlocked': isBlocked,
          })}
          >
            {formattedDate}
          </span>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'isBlocked',
      disableFilters: true,
      disableSortBy: true,
      Cell: ({ row }: Table<Accounts>) => {
        const { isBlocked } = row.original;

        return (<div className="account-management-page__status">{!isBlocked ? 'Active' : 'Blocked'}</div>);
      },
    },
  ];

  const actions = [
    {
      name: 'edit',
      show: (row: Row<Accounts>) => {
        const { isBlocked, canChangeAccountState } = row.original;

        return !isBlocked && canChangeAccountState;
      },
      renderText: () => 'Edit',
      onClick: (e: MouseEventHandler<HTMLInputElement>, row: Row<Accounts>) => navigate(`/account-management/accounts/edit/${row.original.id}`),
    },
    {
      name: 'block',
      show: (row: Row<Accounts>) => {
        const { isBlocked, canChangeAccountState } = row.original;

        return !isBlocked && canChangeAccountState;
      },
      renderText: () => 'Block',
      onClick: (e: MouseEventHandler<HTMLInputElement>, row: Row<Accounts>) => blockAccountsAsync(row.original.id),
    },
    {
      name: 'unblock',
      show: (row: Row<Accounts>) => {
        const { isBlocked, canChangeAccountState } = row.original;

        console.log('isBlocked && canChangeAccountState', isBlocked && canChangeAccountState);
        console.log('canChangeAccountState', canChangeAccountState);

        return isBlocked && canChangeAccountState;
      },
      renderText: () => 'Unblock',
      onClick: (e: MouseEventHandler<HTMLInputElement>, row: Row<Accounts>) => {
        unblockAccountsAsync(row.original.id);
        toast.dismiss(row.original.id);
      },
    },
  ];

  return (
    <section className="account-management-page">
      <h1 className="heading">Account`s list</h1>

      <div className="account-management-page__inner">
        <FilterMenu />

        {accessToChanges.accessPermissions.get('ManageAccounts') && (
          <Button
            className="account-management-page__button"
            onClick={() => navigate('/account-management/accounts/add')}
          >
            Add New Account
          </Button>
        )}
      </div>

      <ClientTable
        tableId="account-table"
        data={accountManagementState.allAccounts}
        renderMobileTitle={(row: Row<{ lastName: string }>) => row.original.lastName}
        order={{
          id: 'lastName',
          desc: false,
        }}
        actions={accessToChanges.accessPermissions.get('ManageAccounts') ? actions : []}
        columns={columns}
        isLoading={isLoading}
      />

    </section>
  );

  async function getAccountsAsync() {
    setIsLoading(true);
    try {
      const { data } = await api.get<Accounts[]>(`${LINK_TO_ACCOUNT_SERVICE}accounts/all`);
      accountManagementState.getAccounts(data);
    } finally {
      setIsLoading(true);
    }
  }

  async function blockAccountsAsync(accountId: number) {
    // remove all notifications, it is necessary to delete the previous notification
    toast.dismiss();

    toast(() => (
      <div className="account-management-page__notification">
        {accountManagementState.accountToUnblock?.middleName ? (
          <span>
            {`${accountManagementState.accountToUnblock?.lastName}
              ${accountManagementState.accountToUnblock?.firstName} 
              ${accountManagementState.accountToUnblock?.middleName}`}
          </span>
        ) : (
          <span>
            {`${accountManagementState.accountToUnblock?.firstName} ${accountManagementState.accountToUnblock?.lastName}`}
          </span>
        )}

        <button
          type="button"
          className="account-management-page__unblock-button"
          onClick={() => {
            toast.dismiss(accountManagementState.accountToUnblock!.id);
            unblockAccountsAsync(accountManagementState.accountToUnblock!.id);
          }}
        >
          Unblock
        </button>
      </div>
    ), {
      position: 'top-center',
      type: 'info',
      icon: false,
      toastId: accountId,
    });

    accountManagementState.blockAccount({ accountId });
    await api.post<Accounts[]>(`${LINK_TO_ACCOUNT_SERVICE}accounts/${accountId}/block`);
  }

  async function unblockAccountsAsync(accountId: number) {
    accountManagementState.unblockAccont({ accountId });
    await api.post<Accounts[]>(`${LINK_TO_ACCOUNT_SERVICE}accounts/${accountId}/unblock`);
  }
}

export default observer(AccountsPageContent);
