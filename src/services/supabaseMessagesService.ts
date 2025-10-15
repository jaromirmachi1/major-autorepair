import { supabase } from "../config/supabase";

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at?: string;
  read?: boolean;
}

const MESSAGES_TABLE = "contact_messages";

/**
 * Add a new contact message to Supabase
 * @param messageData - Message data to add
 * @returns The ID of the created message
 */
export const addMessageToSupabase = async (
  messageData: Omit<ContactMessage, "id" | "created_at" | "read">
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .insert([messageData])
      .select("id");

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      console.log("✅ Message added to Supabase with ID:", data[0].id);
      return data[0].id;
    } else {
      throw new Error(
        "Failed to retrieve ID after adding message to Supabase."
      );
    }
  } catch (error) {
    console.error("❌ Error adding message to Supabase:", error);
    throw error;
  }
};

/**
 * Get all messages from Supabase
 * @returns Array of messages
 */
export const getMessagesFromSupabase = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const messages: ContactMessage[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      created_at: item.created_at,
      read: item.read || false,
    }));

    console.log(`✅ Retrieved ${messages.length} messages from Supabase`);
    return messages;
  } catch (error) {
    console.error("❌ Error getting messages from Supabase:", error);
    throw error;
  }
};

/**
 * Mark a message as read
 * @param messageId - ID of the message to mark as read
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .update({ read: true })
      .eq("id", messageId);

    if (error) {
      throw error;
    }

    console.log("✅ Message marked as read:", messageId);
  } catch (error) {
    console.error("❌ Error marking message as read:", error);
    throw error;
  }
};

/**
 * Delete a message from Supabase
 * @param messageId - ID of the message to delete
 */
export const deleteMessageFromSupabase = async (
  messageId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .delete()
      .eq("id", messageId);

    if (error) {
      throw error;
    }

    console.log("✅ Message deleted from Supabase:", messageId);
  } catch (error) {
    console.error("❌ Error deleting message from Supabase:", error);
    throw error;
  }
};

/**
 * Get unread messages count
 * @returns Number of unread messages
 */
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(MESSAGES_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("read", false);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("❌ Error getting unread messages count:", error);
    return 0;
  }
};
