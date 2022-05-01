import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserToken, UserProfile } from '../interfaces';

class Supabase {

  private client: SupabaseClient;

  constructor() {
    const supabaseUrl: string = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
    const supabaseKey: string = process.env.SUPABASE_SERVICE_KEY || 'service-key';

    this.client = createClient(
      supabaseUrl,
      supabaseKey
    );

    console.log(`🦸 [Supabase] Initialized Supabase client`);
  }

  // User Token
  getToken(id: string): Promise<UserToken> {
    return new Promise(async (resolve, reject) => {
      const { data, error, status } = await this.client
        .from('tokens')
        .select('id,notification')
        .eq('id', id)
        .single();

      if (error && status !== 406) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  // User Profile
  getProfile(id: string, fields: string[]): Promise<UserProfile> {
    return new Promise(async (resolve, reject) => {
      const select = fields && fields.length ? fields.join(', ') : '*';

      const { data, error, status } = await this.client
        .from('profiles')
        .select(select)
        .eq('id', id)
        .single();

      if (error && status !== 406) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  updateProfile(profile: UserProfile) {
    const update = {
      ...profile,
      id: profile.id,
      updated_at: new Date(),
    };

    return new Promise(async (resolve, reject) => {
      const { data, error } = await this.client
        .from('profiles')
        .upsert(update, {
          returning: 'minimal'
        });

      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  }

  // Ring
  async ring(targetUser: string, sourceUser: string) {
    const targetUserProfile = await this.getProfile(targetUser, ['id', 'ringers']);
    const ringers: string[] = targetUserProfile?.ringers || [];

    if (ringers.includes(sourceUser)) {
      return;
    }

    ringers.push(sourceUser);
    this.updateProfile({
      id: targetUserProfile.id,
      ringers,
    });
  }

  async unring(targetUser: string, sourceUser: string) {
    const targetUserProfile = await this.getProfile(targetUser, ['id', 'ringers']);
    const ringers: string[] = targetUserProfile?.ringers || [];

    if (!ringers.includes(sourceUser)) {
      return;
    }

    ringers.splice(ringers.indexOf(sourceUser), 1);
    this.updateProfile({
      id: targetUserProfile.id,
      ringers,
    });
  }

}

export default new Supabase();
