import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserToken, UserProfile } from '../interfaces';

class Supabase {

  private client: SupabaseClient;

  constructor() {
    const supabaseUrl: string = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
    const supabaseKey: string = process.env.SUPABASE_KEY || 'public-anon-key';

    this.client = createClient(
      supabaseUrl,
      supabaseKey
    );

    console.log(`🦸 [Supabase] Initialized Supabase client`);
  }

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

  getProfile(id: string, fields: string[]) {
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

}

export default new Supabase();
