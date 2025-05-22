describe('Test basic user flow from Settings page', () => {

  beforeAll(async () => {
    await page.goto('https://cse110-sp25-group18.github.io/project-card-journaling/pages/settings.html');
  });

  it('Test correct page load', async () => {
    // nav buttons
    const navButtons = await page.$$eval('nav a', (buttons) => {
      return buttons.map((button) => {
        return button.textContent.trim();
      });
    });

    expect(navButtons.length).toBe(5);
    expect(navButtons.includes('Home')).toBe(true);
    expect(navButtons.includes('Create Card')).toBe(true);
    expect(navButtons.includes('Past Entries')).toBe(true);
    expect(navButtons.includes('Shuffle Recap')).toBe(true);
    expect(navButtons.includes('Settings')).toBe(true);

    // Settings group
    const themeToggle = await page.$('#themeToggle'); // right now, this is the streak counter check box?
    const resetBtn = await page.$('#resetBtn');

    expect(themeToggle).not.toBe(null);
    expect(resetBtn).not.toBe(null);
  });
});