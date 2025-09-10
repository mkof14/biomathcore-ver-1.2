"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function ConnectDevicesSection() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: "", type: "" });

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-6 right-6 bg-purple-600 text-white px-4 py-2 rounded shadow z-50";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const createDeviceCard = (data: any, id: string) => {
    const statusText = data.connected ? "Connected" : "Disconnected";
    const statusColor = data.connected ? "text-green-500" : "text-red-500";
    const buttonLabel = data.connected ? "Disconnect" : "Connect";
    return (
      <div
        key={id}
        className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow text-center"
        data-type={data.type}
      >
        <h4 className="text-sm font-medium mb-1">{data.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {data.type}
        </p>
        <p className={`${statusColor} text-xs font-semibold mb-2`}>
          {statusText}
        </p>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-full transition"
          onClick={() => toggleDeviceConnection(id, data.connected)}
        >
          {buttonLabel}
        </button>
      </div>
    );
  };

  const toggleDeviceConnection = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "userDevices", id), { connected: !currentStatus });
    showToast(`${currentStatus ? "Disconnected" : "Connected"} device`);
  };

  const saveNewDevice = async () => {
    const { name, type } = newDevice;
    if (!name.trim() || !type.trim()) return alert("Fill in both fields.");
    await addDoc(collection(db, "userDevices"), {
      name: name.trim(),
      type: type.trim(),
      connected: false,
      timestamp: new Date(),
    });
    setNewDevice({ name: "", type: "" });
    setModalOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "userDevices"),
      (snapshot) => {
        const deviceList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(deviceList);
      },
    );
    return () => unsubscribe();
  }, []);

  return (
    <section
      className="bg-white dark:bg-black text-black dark:text-white py-16 px-6"
      id="connect-devices"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            Connect Your Devices
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Link your health monitoring devices for real-time tracking and
            report generation.
          </p>
        </div>
        {/* Filter */}
        <div className="flex justify-end mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-sm p-2 rounded border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            <option value="Wearable">Wearable</option>
            <option value="Sensor">Sensor</option>
            <option value="Ring">Ring</option>
          </select>
        </div>
        {/* Device Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          id="deviceGrid"
        >
          {devices
            .filter((device) => !filter || device.type === filter)
            .map((device) => createDeviceCard(device, device.id))}
        </div>
        {/* Add Device */}
        <div className="text-center mt-10">
          <button
            onClick={() => setModalOpen(true)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm underline transition"
          >
            + Add another device
          </button>
        </div>
        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
                Add New Device
              </h3>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Device Name
              </label>
              <input
                type="text"
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
                className="w-full p-2 mb-4 rounded border bg-gray-50 dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Device Type
              </label>
              <input
                type="text"
                value={newDevice.type}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, type: e.target.value })
                }
                className="w-full p-2 mb-4 rounded border bg-gray-50 dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNewDevice}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
