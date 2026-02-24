const injectUnderVideo = () => {
    // The container directly below the player
    const anchor = document.querySelector('#below');

    // Ensure we are on a video page and haven't already injected
    if (anchor && !document.querySelector('#my-bottom-extension')) {
        const wrapper = document.createElement('div');
        wrapper.id = 'my-bottom-extension';

        // Using Shadow DOM for style isolation
        const shadow = wrapper.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                .container {
                    background-color: var(--yt-spec-badge-chip-background, #f2f2f2);
                    border-radius: 12px;
                    padding: 16px;
                    margin: 12px 0px;
                    font-family: Roboto, Arial, sans-serif;
                    border: 1px solid rgba(0,0,0,0.1);
                }
                h2 { margin: 0 0 8px 0; font-size: 1.4rem; color: var(--yt-spec-text-secondary); }
                p { margin: 0; color: var(--yt-spec-text-secondary); }
            </style>
            <div class="container">
                <h2>Youtube study companion</h2>
                <p>Your study companion</p>
            </div>
        `;

        // 'prepend' puts it at the very top of the #below section
        anchor.prepend(wrapper);
    }
};

// Use an observer to watch for the #below element appearing in the DOM
const observer = new MutationObserver(() => {
    if (window.location.href.includes("watch")) {
        injectUnderVideo();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
