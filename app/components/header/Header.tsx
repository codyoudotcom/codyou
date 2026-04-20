import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)]', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center z-logo text-bolt-elements-textPrimary cursor-pointer">
        <a href="/" className="text-2xl font-semibold flex items-center gap-2 select-none" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#3B82F6', fontSize: '1.1em', fontWeight: 700, fontFamily: 'monospace' }}>&lt;/&gt;</span>
          <span style={{ marginLeft: '-4px' }}>
            <span style={{ color: '#3B82F6' }}>Cod</span>
            <span className="text-bolt-elements-textPrimary">you</span>
          </span>
        </a>
      </div>
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
