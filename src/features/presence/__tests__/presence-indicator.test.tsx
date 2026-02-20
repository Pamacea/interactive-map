/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PresenceIndicator } from '../ui/presence-indicator';

describe('PresenceIndicator', () => {
  const mockProps = {
    currentUserId: 'user-1',
    maxVisible: 3,
  };

  it('should render nothing when no other users are present', () => {
    const { container } = render(
      <PresenceIndicator
        users={{}}
        {...mockProps}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render when only current user is present', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
    };

    const { container } = render(
      <PresenceIndicator
        users={users}
        {...mockProps}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render single other user', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'Other User',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        {...mockProps}
      />,
    );

    expect(screen.getByText('1 viewer')).toBeInTheDocument();
    expect(screen.getByText('OU')).toBeInTheDocument();
  });

  it('should render multiple users within maxVisible limit', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'Alice Smith',
        userImage: null,
      },
      'user-3': {
        userId: 'user-3',
        userName: 'Bob Jones',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        maxVisible={4}
        currentUserId="user-1"
      />,
    );

    expect(screen.getByText('2 viewers')).toBeInTheDocument();
    expect(screen.getByText('AS')).toBeInTheDocument();
    expect(screen.getByText('BJ')).toBeInTheDocument();
  });

  it('should show remaining count when users exceed maxVisible', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'Alice',
        userImage: null,
      },
      'user-3': {
        userId: 'user-3',
        userName: 'Bob',
        userImage: null,
      },
      'user-4': {
        userId: 'user-4',
        userName: 'Charlie',
        userImage: null,
      },
      'user-5': {
        userId: 'user-5',
        userName: 'Diana',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        maxVisible={2}
        currentUserId="user-1"
      />,
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('4 viewers')).toBeInTheDocument();
  });

  it('should use singular "viewer" when only one other user', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'Other User',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        currentUserId="user-1"
      />,
    );

    expect(screen.getByText('1 viewer')).toBeInTheDocument();
  });

  it('should generate initials from two-word name', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'John Doe',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        currentUserId="user-1"
      />,
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should generate initials from single-word name', () => {
    const users = {
      'user-1': {
        userId: 'user-1',
        userName: 'Current User',
        userImage: null,
      },
      'user-2': {
        userId: 'user-2',
        userName: 'Madonna',
        userImage: null,
      },
    };

    render(
      <PresenceIndicator
        users={users}
        currentUserId="user-1"
      />,
    );

    expect(screen.getByText('MA')).toBeInTheDocument();
  });
});
