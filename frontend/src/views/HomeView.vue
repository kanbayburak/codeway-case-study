<template>
  <DefaultLayout>
    <div v-if="!loading" class="w-full h-full">
      <table class="w-full border border-gray-700 bg-gray-900 shadow-lg table-fixed">
        <thead>
          <tr class="bg-gray-800 text-gray-300 text-sm md:text-base">
            <th class="px-6 py-4 text-left w-1/5">Parameter Key</th>
            <th class="px-6 py-4 text-left w-1/5">Value</th>
            <th class="px-6 py-4 text-left w-2/5">Description</th>
            <th class="px-6 py-4 text-left w-1/5">Create Date</th>
            <th class="px-6 py-4 w-40 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(param, index) in parameters"
            :key="param.key"
            class="border-t border-gray-700 hover:bg-gray-800"
          >
            <td class="px-6 py-4 font-medium">{{ param.key }}</td>
            <td class="px-6 py-4">{{ param.value }}</td>
            <td class="px-6 py-4">{{ param.description }}</td>
            <td class="px-6 py-4">{{ param.date }}</td>
            <td class="px-6 py-4">
              <div class="flex justify-center space-x-2">
                <button
                  @click="editConfig(index)"
                  class="bg-blue-500 px-3 py-1 rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  @click="deleteConfig(index)"
                  class="bg-red-500 px-3 py-1 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr class="border-t border-gray-700 bg-gray-900">
            <td class="px-6 py-3">
              <input
                v-model="newKey"
                placeholder="New Parameter"
                class="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white text-sm"
              />
            </td>
            <td class="px-6 py-3">
              <input
                v-model.number="newValue"
                type="number"
                min="0"
                step="1"
                placeholder="Value"
                class="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white text-sm"
              />
            </td>
            <td class="px-6 py-3">
              <input
                v-model="newDescription"
                placeholder="New Description"
                class="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white text-sm"
              />
            </td>
            <td class="px-6 py-3 text-gray-500">Now</td>
            <td class="px-6 py-3">
              <button
                @click="saveConfig"
                class="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm"
              >
                {{ editIndex !== null ? "Update" : "Add" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-gray-400 mt-20">
      Loading configs...
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { getAuth } from "firebase/auth";
import DefaultLayout from "../layouts/DefaultLayout.vue";

const parameters = ref([]);
const loading = ref(true);

const newKey = ref("");
const newValue = ref("");
const newDescription = ref("");
const editIndex = ref(null);

// .env'den backend URL'sini oku
const API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.warn("Kullanıcı giriş yapmamış");
      return;
    }
    const userToken = await user.getIdToken();

    const res = await axios.get(`${API_URL}/api/admin/config`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    parameters.value = res.data.map((doc) => ({
      key: doc.key,
      value: doc.value,
      description: doc.description || "",
      date: doc.createdAt
        ? new Date(doc.createdAt).toLocaleString()
        : (doc.updatedAt
            ? new Date(doc.updatedAt).toLocaleString()
            : "-"),
    }));
  } catch (err) {
    console.error("Config fetch error:", err.response?.data || err.message);
  } finally {
    loading.value = false;
  }
});

const saveConfig = async () => {
  if (!newKey.value || !newValue.value)
    return alert("Key ve Value boş olamaz!");

  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return alert("Önce giriş yapmalısınız!");

  const userToken = await user.getIdToken();

  try {
    if (editIndex.value !== null) {
      await axios.put(
        `${API_URL}/api/admin/config/${newKey.value}`,
        {
          value: newValue.value,
          description: newDescription.value || "No description",
          clientUpdatedAt: Date.now(),
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      parameters.value[editIndex.value] = {
        key: newKey.value,
        value: newValue.value,
        description: newDescription.value || "No description",
        date: new Date().toLocaleString(),
      };
      editIndex.value = null;
    } else {
      await axios.post(
        `${API_URL}/api/admin/config`,
        {
          key: newKey.value,
          value: newValue.value,
          description: newDescription.value || "No description",
          audiences: {},
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      parameters.value.push({
        key: newKey.value,
        value: newValue.value,
        description: newDescription.value || "No description",
        date: new Date().toLocaleString(),
      });
    }

    newKey.value = "";
    newValue.value = "";
    newDescription.value = "";
  } catch (err) {
    console.error("Save error:", err.response?.data || err.message);
    alert("Config kaydedilemedi!");
  }
};

const deleteConfig = async (index) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return alert("Önce giriş yapmalısınız!");
  const userToken = await user.getIdToken();

  const key = parameters.value[index].key;

  try {
    await axios.delete(`${API_URL}/api/admin/config/${key}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    parameters.value.splice(index, 1);
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert("Config silinemedi!");
  }
};

const editConfig = (index) => {
  const param = parameters.value[index];
  newKey.value = param.key;
  newValue.value = param.value;
  newDescription.value = param.description;
  editIndex.value = index;
};
</script>
