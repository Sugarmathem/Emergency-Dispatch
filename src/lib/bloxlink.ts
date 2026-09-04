/**
 * Look up a Roblox user by username using the PUBLIC Roblox API (no key needed)
 */
export async function verifyRobloxUsername(
  username: string
): Promise<{ robloxId: string; robloxUsername: string } | null> {
  try {
    console.log(`🎮 Looking up Roblox username: ${username}`);

    const response = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Roblox API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as {
      data?: Array<{ id: number; name: string }>;
    };

    const user = data.data?.[0];
    if (!user) {
      console.log(`❌ Roblox username not found: ${username}`);
      return null;
    }

    console.log(`✅ Found Roblox user: ${user.name} (ID: ${user.id})`);

    return {
      robloxId: String(user.id),
      robloxUsername: user.name,
    };
  } catch (err) {
    console.error('❌ verifyRobloxUsername error:', err);
    return null;
  }
}

/**
 * Optional: Try Bloxlink first if API key exists, otherwise return null
 * This is a fallback for Discord-to-Roblox mapping without user input
 */
export async function getRobloxIdentityFromBloxlink(
  discordId: string,
  guildId: string
): Promise<{ robloxId: string; robloxUsername: string } | null> {
  const apiKey = process.env.BLOXLINK_API_KEY;
  if (!apiKey) {
    // No key, silently skip Bloxlink
    return null;
  }

  try {
    console.log(`🔗 Bloxlink: Looking up Discord ${discordId} in guild ${guildId}`);

    const response = await fetch(
      `https://api.bloxlink.dev/v4/public/guilds/${guildId}/discord-to-roblox/${discordId}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    console.log(`📡 Bloxlink API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Bloxlink API error: ${response.status} — ${errorBody}`);
      return null;
    }

    const data = (await response.json()) as {
      robloxId?: string;
      id?: string;
      primaryAccount?: string;
      [key: string]: unknown;
    };

    console.log(`✅ Bloxlink response:`, data);

    const robloxId = data.robloxId || data.id || data.primaryAccount;
    if (!robloxId || typeof robloxId !== 'string') {
      console.error(`❌ No robloxId in Bloxlink response`);
      return null;
    }

    console.log(`🎮 Found Roblox ID: ${robloxId}`);

    // Get username from Roblox API
    const userResponse = await fetch(`https://users.roblox.com/v1/users/${robloxId}`);

    if (!userResponse.ok) {
      console.error(`❌ Roblox API error: ${userResponse.status}`);
      return null;
    }

    const userData = (await userResponse.json()) as {
      name?: string;
    };

    if (!userData.name || typeof userData.name !== 'string') {
      console.error(`❌ No username in Roblox response`);
      return null;
    }

    console.log(`👤 Found Roblox username: ${userData.name}`);

    return {
      robloxId,
      robloxUsername: userData.name,
    };
  } catch (err) {
    console.error('❌ getRobloxIdentityFromBloxlink error:', err);
    return null;
  }
}
