const Service = require("../models/Service");

exports.addService = async (req, res) => {
  try {
    const { name, icon, videoURL } = req.body;

    if (!name || !icon || !videoURL) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const service = await Service.create({ name, icon, videoURL });

    return res.status(201).json({ message: "Serviço criado", service });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
};

exports.listServices = async (_req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, videoURL, languages } = req.body;

    // monta objeto só com campos enviados
    const update = {};
    if (name !== undefined) update.name = name;
    if (icon !== undefined) update.icon = icon;
    if (videoURL !== undefined) update.videoURL = videoURL;
    if (languages !== undefined) update.languages = languages;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "Nenhum campo enviado para atualizar" });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar serviço" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    res.json({ message: "Serviço removido", deletedService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar serviço" });
  }
};
